"use client";

import Image from "next/image";
import Link from "next/link";

export default function Instruction() {
  const steps = [
    {
      step: "Step 1",
      title: "Take a Clear Photo",
      description:
        "Take a well-lit, focused photo of the skin area you want to analyze. Ensure the area is centered and clearly visible without shadows or obstructions.",
      image: "/step1.png",
    },
    {
      step: "Step 2",
      title: "Upload Your Image",
      description:
        "Upload the photo using the upload feature. The tool works on both mobile and desktop, allowing you to easily submit your image for analysis.",
      image: "/step2.png",
    },
    {
      step: "Step 3",
      title: "AI Analysis",
      description:
        "Our AI model analyzes the image and detects visual patterns related to different skin conditions, generating a prediction and confidence score.",
      image: "/step3.png",
    },
    {
      step: "Step 4",
      title: "View Your Results",
      description:
        "Receive a summary including risk classification, confidence score, and recommendations. A downloadable PDF report with the image snapshot may also be provided.",
      image: "/step4.png",
    },
  ];

  return (
    <section id="diagnostics" className="w-full py-16 bg-white border-y border-[#005C51]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-bold mb-12 text-black font-inter">
          Try Diagnostics
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center border border-[#005C51] rounded-lg p-6"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={160}
                height={160}
                className="mb-4 object-contain"
              />

              <p className="text-[#005C51] font-semibold mb-1 font-inter">
                {item.step}
              </p>

              <h3 className="text-lg font-semibold text-black mb-2 font-inter">
                {item.title}
              </h3>

              <p className="text-gray-600 text-sm font-inter">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <br></br>
          <Link
            href="../diagnostics"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-900 px-8 py-4 text-[20px] font-semibold text-white hover:bg-emerald-800 transition-colors mt-10 animate-bounce"
          >
            Go Try Right Now!
          </Link>
      </div>
    </section>
  );
}