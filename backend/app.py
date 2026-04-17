import io
import os
from typing import Dict, Tuple, Optional

import torch
import torch.nn as nn
import torch.nn.functional as F
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from PIL import Image

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from torchvision import transforms
from torchvision.models import efficientnet_v2_s, EfficientNet_V2_S_Weights
from datetime import datetime


# -------------------------
# CONFIG (MATCH NOTEBOOK)
# -------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "Model", "model.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

NUM_CLASSES = 3

# Your notebook ordering: malignant, benign, non-neoplastic
IDX_TO_CLASS = {
    0: "Malignant",
    1: "Benign",
    2: "Non-neoplastic",
}

# Your notebook input size
INPUT_SIZE = 384

# Your notebook normalization
IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD  = (0.229, 0.224, 0.225)


# -------------------------
# MODEL LOADING (ROBUST)
# -------------------------
def build_model(num_classes: int = NUM_CLASSES) -> torch.nn.Module:
    # same backbone you used
    model = efficientnet_v2_s(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(in_features, num_classes)
    return model

def load_model() -> torch.nn.Module:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at: {MODEL_PATH}")

    obj = torch.load(MODEL_PATH, map_location=DEVICE)

    # Case A: saved full model (torch.save(model, path))
    if isinstance(obj, torch.nn.Module):
        model = obj.to(DEVICE).eval()
        return model

    # Case B: saved state_dict (torch.save(model.state_dict(), path))
    if isinstance(obj, dict):
        model = build_model(NUM_CLASSES)
        model.load_state_dict(obj)
        model = model.to(DEVICE).eval()
        return model

    raise RuntimeError("Unrecognized model.pth format. Save either full model or state_dict.")

MODEL = load_model()


# -------------------------
# PREPROCESS (MATCH VAL/TEST)
# -------------------------
VAL_TEST_TRANSFORMS = transforms.Compose([
    transforms.Resize((INPUT_SIZE, INPUT_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
])

def preprocess_pil(img: Image.Image) -> torch.Tensor:
    x = VAL_TEST_TRANSFORMS(img.convert("RGB")).unsqueeze(0)  # [1,3,H,W]
    return x


# -------------------------
# PREDICTION
# -------------------------
@torch.no_grad()
def predict(img: Image.Image) -> Tuple[str, float, Dict[str, float], int]:
    x = preprocess_pil(img).to(DEVICE)
    logits = MODEL(x)
    probs = torch.softmax(logits, dim=1)[0]

    conf, idx = torch.max(probs, dim=0)
    idx_int = int(idx.item())

    label = IDX_TO_CLASS[idx_int]
    conf_pct = float(conf.item() * 100.0)

    probs_dict = {IDX_TO_CLASS[i]: float(probs[i].item() * 100.0) for i in range(NUM_CLASSES)}
    return label, conf_pct, probs_dict, idx_int


# -------------------------
# GRAD-CAM (OPTIONAL VISUAL MARKERS)
#   Target: EfficientNetV2 features[-1]
# -------------------------
def make_gradcam_overlay(original_img: Image.Image, class_idx: int) -> Optional[Image.Image]:
    """
    Returns a PIL image of the original resized image blended with a heat overlay.
    If anything fails, returns None.
    """
    try:
        model = MODEL
        model.eval()

        # Target layer for EfficientNetV2-S
        target_layer = model.features[-1]

        activations = []
        gradients = []

        def fwd_hook(_, __, out):
            activations.append(out)

        def bwd_hook(_, grad_in, grad_out):
            gradients.append(grad_out[0])

        h1 = target_layer.register_forward_hook(fwd_hook)
        h2 = target_layer.register_full_backward_hook(bwd_hook)

        x = preprocess_pil(original_img).to(DEVICE)
        logits = model(x)
        score = logits[0, class_idx]

        model.zero_grad(set_to_none=True)
        score.backward()

        h1.remove()
        h2.remove()

        A = activations[0]  # [1,C,h,w]
        G = gradients[0]    # [1,C,h,w]

        weights = G.mean(dim=(2, 3), keepdim=True)      # [1,C,1,1]
        cam = (weights * A).sum(dim=1, keepdim=True)    # [1,1,h,w]
        cam = F.relu(cam)

        cam = cam.squeeze().detach().cpu()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

        cam = cam.unsqueeze(0).unsqueeze(0)  # [1,1,h,w]
        cam = F.interpolate(cam, size=(INPUT_SIZE, INPUT_SIZE), mode="bilinear", align_corners=False)
        cam = cam.squeeze().numpy()          # [H,W]

        # Build heat overlay (red channel)
        import numpy as np
        heat = np.zeros((INPUT_SIZE, INPUT_SIZE, 3), dtype=np.float32)
        heat[..., 0] = cam
        heat = (heat * 255).clip(0, 255).astype(np.uint8)
        heat_img = Image.fromarray(heat, mode="RGB")

        base = original_img.convert("RGB").resize((INPUT_SIZE, INPUT_SIZE))
        blended = Image.blend(base, heat_img, alpha=0.35)
        return blended

    except Exception:
        return None

# -------------------------
# GET RECOMMENDATION
# -------------------------
def get_recommendation(label: str) -> str:
    # Keep these roughly the same length (2 sentences each) so they render similarly.
    if label == "Malignant":
        return (
            "This result suggests higher risk. Please seek medical advice promptly, especially if the lesion is new, changing, painful, or bleeding."
        )
    elif label == "Benign":
        return (
            "This result suggests lower risk. Monitor for changes, and seek medical advice if the lesion becomes new, changing, painful, or bleeding."
        )
    else:  # Non-neoplastic
        return (
            "This result suggests a non-neoplastic finding. Continue routine monitoring, and seek medical advice if the lesion becomes new, changing, painful, or bleeding."
        )

# -------------------------
# PDF REPORT
# -------------------------
def build_pdf(
    original_img: Image.Image,
    label: str,
    conf_pct: float,
    probs_dict: Dict[str, float],
    overlay_img: Optional[Image.Image],
) -> io.BytesIO:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    W, H = letter

    c.drawString(50, H - 20, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, H - 50, "Skin Lesion Classification Report")

    # Disclaimer
    disclaimer = (
        "Disclaimer: This output is generated by an AI model and is NOT a medical diagnosis. "
        "Confidence is not certainty. If you have concerns about a skin lesion, consult a qualified healthcare professional."
    )
    styles = getSampleStyleSheet()
    style = styles["Normal"]
    style.fontSize = 10
    style.alignment = 4

    p = Paragraph(disclaimer, style)
    p.wrapOn(c, 500, 100)
    p.drawOn(c, 50, H - 90)

    # Images (left original, right overlay)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(W/2, H - 120, "Image snapshot")

    img_size = 240
    center_x = (W - img_size) / 2

    center_img = original_img.convert("RGB").resize((img_size, img_size))
    c.drawImage(
        ImageReader(center_img),
        center_x,
        H - 370,
        width=img_size,
        height=img_size,
        mask="auto"
    )

    # Results
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, H - 410, "Results")

    c.setFont("Helvetica", 11)

    if label == "Malignant":
        c.setFillColorRGB(1,0,0)
    elif label == "Benign":
        c.setFillColorRGB(1,0.6,0)
    else:
        c.setFillColorRGB(0,0.6,0)

    c.drawString(50, H - 435, f"Risk classification: {label}")
    c.setFillColorRGB(0,0,0)
    c.drawString(50, H - 455, f"Confidence score: {conf_pct:.2f}%")

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, H - 485, "Class probabilities")
    c.setFont("Helvetica", 10)
    y = H - 505
    for k, v in sorted(probs_dict.items(), key=lambda kv: -kv[1]):
        c.drawString(60, y, f"- {k}: {v:.2f}%")
        y -= 14

    # Recommendation + next steps (keep cautious)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y - 10, "Recommendation")
    c.setFont("Helvetica", 10)
    rec = get_recommendation(label)
    p = Paragraph(rec, style)
    p.wrapOn(c, 500, 100)
    p.drawOn(c, 50, y - 45)

    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y - 65, "Next steps")
    c.setFont("Helvetica", 10)
    c.drawString(60, y - 82, "- Track changes over time using clear photos (same lighting/distance).")
    c.drawString(60, y - 96, "- Seek professional advice for concerning symptoms or rapid changes.")
    c.drawString(60, y - 110, "- Do not use this report as the sole basis for medical decisions.")

    c.showPage()
    c.save()
    buf.seek(0)
    return buf


# -------------------------
# FASTAPI APP
# -------------------------
app = FastAPI(title="Skin Lesion Classifier Backend")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "device": str(DEVICE), "model_path": MODEL_PATH}

@app.post("/predict")
async def predict_json(file: UploadFile = File(...)):
    raw = await file.read()
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image.")

    label, conf_pct, probs_dict, _ = predict(img)
    rec = get_recommendation(label)
    return JSONResponse({
        "label": label,
        "confidence_pct": round(conf_pct, 2),
        "probabilities_pct": {k: round(v, 2) for k, v in probs_dict.items()},
        "recommendation": rec,
    })

@app.post("/report")
async def report_pdf(file: UploadFile = File(...)):
    raw = await file.read()
    try:
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image.")

    label, conf_pct, probs_dict, class_idx = predict(img)

    # Optional Grad-CAM overlay
    overlay = make_gradcam_overlay(img, class_idx)

    pdf_buf = build_pdf(
        original_img=img,
        label=label,
        conf_pct=conf_pct,
        probs_dict=probs_dict,
        overlay_img=overlay,
    )

    headers = {"Content-Disposition": 'inline; filename="skin_lesion_report.pdf"'}
    return StreamingResponse(pdf_buf, media_type="application/pdf", headers=headers)