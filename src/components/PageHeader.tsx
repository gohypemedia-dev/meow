"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface PageHeaderProps {
  backHref?: string;
  backText?: string;
}

export default function PageHeader({
  backHref = "/",
  backText = "Back",
}: PageHeaderProps) {
  return (
    <header className="relative z-50 w-full px-4 sm:px-8 md:px-12 flex items-center justify-between min-h-[76px] sm:min-h-[88px] md:min-h-[96px] shrink-0 py-3 sm:py-3.5 border-b border-white/10 bg-[#111317] overflow-hidden">
      {/* Brand Logo - Balanced on mobile so it never overflows */}
      <Link href="/" className="flex items-center cursor-pointer group shrink-0 min-w-0">
        <Image
          src="/meowganics_logo_transparent.png"
          alt="MeowGanics Logo"
          width={1776}
          height={725}
          className="w-[46vw] xs:w-[50vw] sm:w-[240px] md:w-[285px] lg:w-[340px] max-w-[190px] xs:max-w-[225px] sm:max-w-none h-auto max-h-[60px] xs:max-h-[72px] sm:max-h-[84px] md:max-h-[92px] lg:max-h-[139px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.10)]"
          priority
        />
      </Link>

      {/* Right Actions: Back Button */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-3">
        <Link
          href={backHref}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-heading font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 active:scale-95 shrink-0"
        >
          <svg className="w-3.5 h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{backText}</span>
        </Link>
      </div>
    </header>
  );
}
