import Image from "next/image";

export default function Title() {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/how_it_works.png"
          alt="Skin cancer cells"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center px-6">

          <h1 className="text-white text-5xl md:text-6xl font-semibold tracking-tight drop-shadow-lg">
            Skin Cancer AI
          </h1>

          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow">
            Early Detection and Diagnosis
          </p>

          {/* Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <a href="#diagnostics" className="rounded-xl bg-white text-slate-900 px-6 py-3 font-medium shadow hover:bg-slate-100 transition inline-block">
              Try Diagnostic
            </a>

            <a href="#chatbot" className="rounded-xl border border-white/70 text-white px-6 py-3 font-medium backdrop-blur-sm hover:bg-white/10 transition inline-block">
              Live Chatbot
            </a>
          </div>

        </div>
      </div>

    </section>
  );
}