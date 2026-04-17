"use client";

import Link from "next/link";
import Image from "next/image";

const nav = [
  { label: "Why Us", href: "#why-us" },
  { label: "ChatBot", href: "#chatbot" },
  { label: "Connect", href: "#connect" },

];

export default function Navbar() {
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

          {/* Right: Links + CTA */}
          <div className="ml-auto flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-[16px] text-slate-600">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-slate-900 transition-colors"
                >
                  {item.label}
                </a>
              ))}

            </nav>

            <a
              href="#diagnostics"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-900 px-5 py-3 text-[16px] font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              Try Diagnostic
            </a>
          </div>

        </div>
      </div>

      {/* Subtle divider */}
      <div className="h-px w-full bg-slate-200" />
    </header>
  );
}