"use client";

import Link from "next/link";
import Image from "next/image";

export default function NavbarDiagnostics() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex items-center py-5">

          {/* Left: Logo + Brand */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Skin Cancer AI Logo"
              width={40}
              height={40}
              className="object-contain"
            />

            <div className="leading-tight">
              <div className="text-[24px] font-semibold text-slate-900">
                Skin Cancer AI
              </div>
            </div>
          </Link>

          {/* Right: Single Home Link */}
          <div className="ml-auto flex items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-2.5 text-[16px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-slate-200" />
    </header>
  );
}