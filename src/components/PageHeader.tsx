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
    <header className="relative z-50 w-full px-4 sm:px-8 md:px-12 flex items-center justify-between min-h-[108px] xs:min-h-[118px] sm:min-h-[88px] md:min-h-[96px] shrink-0 pt-2.5 pb-2 sm:pt-3 sm:pb-3 border-b border-white/10 bg-[#111317] overflow-hidden">
      {/* Brand Logo - same size as the home page navbar */}
      <Link href="/" className="flex items-center cursor-pointer group shrink min-w-0">
        <Image
          src="/meowganics_logo_transparent.png"
          alt="MeowGanics Logo"
          width={1776}
          height={725}
          className="w-[72vw] xs:w-[74vw] max-w-[315px] sm:max-w-none sm:w-[260px] md:w-[285px] lg:w-[340px] h-auto max-h-[114px] xs:max-h-[126px] sm:max-h-[84px] md:max-h-[92px] lg:max-h-[139px] object-contain object-left transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.10)]"
          priority
        />
      </Link>

      {/* Right Actions: Back Button (icon-only on phones so the full-size logo fits) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-3">
        <Link
          href={backHref}
          aria-label={backText}
          className="flex items-center justify-center gap-1.5 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-heading font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 active:scale-95 shrink-0"
        >
          <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">{backText}</span>
        </Link>
      </div>
    </header>
  );
}
