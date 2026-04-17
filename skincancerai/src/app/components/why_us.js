import Image from "next/image";

function Tile({ variant, icon, title, desc }) {
  const bg =
    variant === "mint"
      ? "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600"      
      : variant === "deep"
      ? "bg-gradient-to-br from-emerald-700 to-emerald-950"
      : variant === "lime"
      ? "bg-[radial-gradient(circle_at_50%_45%,rgba(190,242,100,0.95),rgba(16,99,74,0.9)_70%)]"
      : "bg-gradient-to-br from-slate-200 to-emerald-900";

  return (
    <div className={`relative h-[220px] rounded-2xl p-6 flex flex-col justify-end text-white ${bg}`}>
      
      {/* icon */}
      <div className="absolute top-6 left-6">
        <Image
          src={icon}
          alt=""
          width={68}
          height={68}
          className="opacity-90 invert"
        />
      </div>

      {/* text */}
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-sm text-white/80 mt-1">{desc}</p>
      </div>

    </div>
  );
}

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-16">

        {/* Header */}
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold text-slate-900">
            Why Us?
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            A convenient skin cancer diagnostic tool for fast and reliable results
          </p>
        </div>

        {/* Tile grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left column */}
          <div className="grid gap-6">
            <Tile
              variant="mint"
              icon="/camera.png"
              title="Quick Image Upload"
              desc="Upload a skin image directly from your device for rapid analysis."
            />

            <Tile
              variant="deep"
              icon="/hospital.png"
              title="Clinically Minded Design"
              desc="Built with evaluation methods aligned with real diagnostic priorities."
            />
          </div>

          {/* Right column (staggered) */}
          <div className="grid gap-6 md:mt-10">
            <Tile
              variant="lime"
              icon="/ai.png"
              title="AI-Powered Detection"
              desc="Deep learning models analyze visual features to support screening."
            />

            <Tile
              variant="slate"
              icon="/report.png"
              title="Clear Result Summary"
              desc="Receive an easy-to-understand report of the model’s prediction."
            />
          </div>

        </div>

      </div>
    </section>
  );
}