"use client";

import { useState } from "react";
import Navbar from "../components/navbar_diagnostics";

export default function DiagnosticsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setResult(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const analyzeImage = async () => {
    if (!image) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("file", image);

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Request failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!image) {
      setError("Please choose an image first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("file", image);

      const res = await fetch(`${API_BASE}/report`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Report request failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err?.message || "Could not generate report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/60 blur-3xl" />
            <div className="absolute top-10 right-[-120px] h-[420px] w-[420px] rounded-full bg-teal-300/50 blur-3xl" />
            <div className="absolute bottom-[-160px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-lime-200/50 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-6 py-16 relative">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 text-white p-8 md:p-14 shadow-xl">
              <p className="text-white/80 text-sm mb-3">Try Diagnostics</p>

              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                Upload a skin image for an AI-assisted assessment
              </h1>

              <p className="mt-4 max-w-3xl text-base md:text-lg text-white/85 leading-relaxed">
                Informational only — not a medical diagnosis. If you’re concerned,
                please contact a licensed healthcare professional.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Upload card */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-7 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-900">Upload image</h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                JPG/PNG recommended. For better results, use sharp focus, good
                lighting, and keep the lesion centered in the frame.
              </p>

              <div className="mt-6">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Choose file
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3 block w-full text-sm
                      file:mr-4 file:rounded-xl file:border-0
                      file:bg-emerald-900 file:px-4 file:py-2.5 file:text-white
                      file:cursor-pointer
                      hover:file:bg-emerald-800
                      text-slate-600"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {preview ? (
                <div className="mt-6 flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-2xl max-h-72 w-full object-contain border border-slate-200 bg-slate-50"
                  />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-slate-100 h-64 flex items-center justify-center text-slate-500 border border-slate-200">
                  Image preview
                </div>
              )}

              <button
                type="button"
                onClick={analyzeImage}
                className="mt-6 w-full rounded-xl bg-emerald-900 py-3.5 cursor-pointer text-white text-base font-semibold hover:bg-emerald-800 transition-colors"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>

              <p className="mt-3 text-xs text-slate-500">
                This tool is intended for educational and informational use only.
              </p>
            </div>

            {/* Result card */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 md:p-7 flex flex-col">
              <h2 className="text-2xl font-semibold text-slate-900">Result</h2>

              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Disclaimer: This output is generated by an AI model and is not a
                medical diagnosis. If you are concerned about a skin lesion, please
                consult a qualified healthcare professional.
              </p>

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col gap-4 flex-1 justify-between">
                {result ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-lg font-semibold text-slate-800">
                        Prediction
                      </span>
                      <span className="text-lg text-slate-700 font-medium">
                        {result.label} ({result.confidence_pct}%)
                      </span>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(result.probabilities_pct).map(([name, pct]) => (
                        <div key={name}>
                          <div className="flex justify-between text-sm text-slate-600">
                            <span>{name}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="mt-1.5 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-2.5 bg-emerald-900 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={downloadReport}
                      className="mt-3 w-full rounded-xl border border-emerald-900 text-emerald-900 py-3.5 font-semibold hover:bg-emerald-50 transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Open PDF report"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-800">
                        Prediction
                      </span>
                      <span className="text-sm text-slate-500">
                        {loading ? "Analyzing..." : ""}
                      </span>
                    </div>

                    <div className="mt-2 space-y-3">
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                      <SkeletonRow />
                    </div>

                    <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-600">
                      <div className="font-semibold text-slate-800 mb-1">Notes</div>
                      Upload an image and click Analyze to see the model output here.
                    </div>
                  </>
                )}
              </div>

              {result && (
                <div className="mt-5">
                  <div className="font-semibold text-slate-800 mb-2">
                    Recommendation
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 text-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Skin Cancer AI. Western Cyber Society
              (WCS). All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 w-24 rounded-full bg-slate-200" />
      <div className="h-2.5 flex-1 rounded-full bg-slate-200" />
      <div className="h-2.5 w-10 rounded-full bg-slate-200" />
    </div>
  );
}