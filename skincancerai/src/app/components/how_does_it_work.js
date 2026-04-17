import Image from "next/image";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/70 p-4 border border-white/60">
      <div className="text-xs font-medium text-slate-600">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function HowItWorksModel() {
  return (
    <section id="how-it-works" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-16">
        {/* Header */}
        <div id="user-guide" className="mt-16 max-w-2xl">
          <h3 className="text-2xl font-semibold text-slate-900">
            How does it work?
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Model highlights and performance at a glance.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: short highlights */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-300 bg-white p-6">
              <h4 className="text-lg font-semibold text-slate-900">
                Model Highlights
              </h4>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Our detection model is built on <span className="font-semibold">EfficientNetV2-S</span>,
                pre-trained on ImageNet and fine-tuned on the{" "}
                <span className="font-semibold">Fitzpatrick17k</span> dataset to classify skin lesions into{" "}
                <span className="font-semibold">malignant, benign,</span> and{" "}
                <span className="font-semibold">non-neoplastic</span> categories.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Training uses robustness-focused techniques like data augmentation, MixUp,
                and label smoothing to improve generalization on unseen images.
              </p>

              <p className="mt-5 text-xs text-slate-500">
                Note: This tool is intended for screening support and does not replace
                professional medical evaluation.
              </p>
            </div>
          </div>

          {/* Right: stat card + small visual */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-100 p-6 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900">
                Performance
              </h4>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Stat label="Classes" value="3" />
                <Stat label="Accuracy" value="91.37%" />
                <Stat label="Macro F1" value="87.53%" />
                <Stat label="Malignant recall" value="89.05%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}