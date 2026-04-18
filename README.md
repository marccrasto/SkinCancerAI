# Skin Cancer Diagnostics AI

Skin Cancer Diagnostics AI is a machine learning-powered web application that performs AI-assisted classification of skin lesion images.

It allows users to upload an image of a skin lesion and receive a prediction indicating whether it is malignant, benign, or non-neoplastic, along with confidence scores and recommendations.

---

## 🚀 Live Demo

https://skin-cancer-ai-gules.vercel.app

> Note: The public demo uses a **sample PDF report** due to deployment resource constraints.  
> The full machine learning pipeline and report generation system are included in this repository.

---

## 📌 What It Does

- Upload an image of a skin lesion  
- Analyze the image using a trained deep learning model  
- Classify the lesion into:
  - Malignant  
  - Benign  
  - Non-neoplastic  
- Display confidence scores for each class  
- Provide a recommendation based on the prediction  
- View a sample PDF report (demo mode)

---

## 🧠 How It Works

1. The uploaded image is preprocessed (resized, normalized)  
2. The image is passed through a trained EfficientNetV2-S model  
3. The model outputs class probabilities  
4. The highest probability determines the predicted label  
5. A recommendation is generated based on the classification  
6. (Optional) A PDF report is generated locally or replaced with a demo report in deployment  

---

## ⚙️ How to Use

1. Go to the Diagnostics page  
2. Upload a skin lesion image  
3. Click **Analyze** (might take 1-2 minutes for the backend to respond)  
4. View:
   - Predicted classification  
   - Confidence score  
   - Class probabilities  
   - Recommendation  
5. Click **Open PDF Report** (or demo report in deployed version)
6. This application includes a chatbot feature (on the homepage) powered by Groq API. To use the chatbot locally, you must provide your own Groq API key.

---

## ❗ Important Notes

- This tool is for **educational and informational purposes only**  
- It is **not a medical diagnosis**  
- Always consult a qualified healthcare professional for medical concerns  

---

## 🛠️ Tech Stack

**Frontend**
- Next.js  
- React  
- Tailwind CSS  

**Backend**
- Python  
- FastAPI  

**Machine Learning**
- PyTorch  
- EfficientNetV2-S  
- NumPy  
- Pillow  

**Deployment**
- Vercel (Frontend)  
- Render (Backend)  

**Other Tools**
- ReportLab (PDF generation)  
- Git LFS (model storage)  

---

## 💻 Running Locally

To run the full application (including live PDF generation) locally:

### 1. Clone the repository

```
git clone https://github.com/junakim0118/WCS_SkinCancerDiagnosticsAI.git
cd WCS_SkinCancerDiagnosticsAI
```

---

### 2. Install backend dependencies

```
cd backend
pip install -r requirements.txt
```

---

### 3. Download the model

```
git lfs pull
```
---

### 4. Set environment variables

```
Create a `.env.local` file in the frontend folder:
GROQ_API_KEY=YOURGROQAPIKEY
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
NEXT_PUBLIC_DEMO_MODE=false
```

---

### 5. Run the backend

```
cd backend
uvicorn app:app --reload
```

---

### 6. Run the frontend

```
cd skincancerai
npm install
npm run build
npm run dev
# Open in browser (http://localhost:3000)
```

## 🎯 Why This Project

Early detection is critical in skin cancer outcomes, yet access and delays remain real challenges. This project explores how AI can support faster, more accessible preliminary screening, especially for non-experts.

---

## ⚠️ Limitations

- Public demo uses a **sample PDF report** instead of live generation  
- Backend deployment has limited memory (512MB), restricting heavy operations like PDF rendering  
- Model performance depends on image quality (lighting, focus, framing)  
- Not intended for clinical or diagnostic use  

---

## 🔮 Future Improvements

- Move model inference to a scalable cloud service  
- Enable full PDF generation in production  
- Add Grad-CAM visual explanations  
- Improve dataset diversity for better generalization  
- Add user authentication and report history  

---

## 👥 Contributors

**Project Manager:**
Juna Kim

**Directors:**   
Brian Lee, 
Chelsea Ye, 
Diya Patel,
Kamal Chahal, 
Marc Crasto, 
Raiyan Butt 
