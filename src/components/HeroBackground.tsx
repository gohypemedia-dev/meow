"use client";

import React from "react";
import Image from "next/image";

// The cat's eyes, measured in each artwork's own pixel space. Each eye is redrawn on top of the
// artwork (blue ellipse + black pupil) so the pupils can glance around.
type Eye = { cx: number; cy: number; rx: number; ry: number; px: number; py: number; prx: number; pry: number };
const EYES_DESKTOP: { w: number; h: number; eyes: Eye[] } = {
  w: 1672,
  h: 941,
  eyes: [
    { cx: 1027.5, cy: 719.5, rx: 52, ry: 48, px: 1031.5, py: 717, prx: 17, pry: 25 },
    { cx: 1194, cy: 718.5, rx: 55.5, ry: 50, px: 1185.5, py: 716.5, prx: 17, pry: 25 },
  ],
};
const EYES_MOBILE: typeof EYES_DESKTOP = {
  w: 941,
  h: 1672,
  eyes: [
    { cx: 589, cy: 1324, rx: 49.5, ry: 48.5, px: 592.5, py: 1322.5, prx: 17, pry: 24.5 },
    { cx: 743.5, cy: 1323.5, rx: 53, ry: 50, px: 734.5, py: 1322.5, prx: 17, pry: 24.5 },
  ],
};

function CatEyes({ art, id }: { art: typeof EYES_DESKTOP; id: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${art.w} ${art.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {art.eyes.map((e, i) => (
        <g key={i}>
          <clipPath id={`${id}-eye-${i}`}>
            <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} />
          </clipPath>
          <g clipPath={`url(#${id}-eye-${i})`}>
            <ellipse cx={e.cx} cy={e.cy} rx={e.rx + 1} ry={e.ry + 1} fill="#A2DEFC" />
            <ellipse className="cat-pupil" cx={e.px} cy={e.py} rx={e.prx} ry={e.pry} fill="#000" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** Decorative cream "brick" accents. Rendered separately from the hero artwork so they stay on
 *  screen across every cream-background step of the scroll experience. */
export function HeroBricks() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* ── Decorative Brick Accents (Color: #EDDEC5) Matching Mockup ── */}
      {/* Top Right Brick Cluster */}
      <div className="absolute top-24 sm:top-28 right-4 sm:right-12 md:right-20 flex flex-col gap-2 opacity-90">
        <div className="flex gap-2">
          <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
          <div className="w-16 sm:w-20 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        </div>
        <div className="flex gap-2 ml-6 sm:ml-8">
          <div className="w-20 sm:w-24 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
          <div className="w-10 sm:w-14 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        </div>
      </div>

      {/* Right Middle Brick Accent */}
      <div className="absolute top-[26%] sm:top-[28%] right-3 sm:right-8 md:right-16 flex flex-col gap-2 opacity-80">
        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        <div className="w-12 sm:w-16 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px] ml-4" />
      </div>

      {/* Left Middle Brick Cluster (above left litter hill) */}
      <div className="absolute top-[24%] sm:top-[26%] left-3 sm:left-8 md:left-14 flex flex-col gap-2 opacity-80">
        <div className="flex gap-2">
          <div className="w-14 sm:w-18 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
          <div className="w-10 sm:w-14 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px]" />
        </div>
        <div className="w-16 sm:w-22 h-3 sm:h-4 bg-[#EDDEC5] rounded-[3px] ml-5" />
      </div>
    </div>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Base Peach Background ── */}
      <div className="absolute inset-0 bg-[#FEF8EA]" />

      {/* Brick accents live in <HeroBricks /> so they can stay visible after scrolling. */}

      {/* ── Seamless White Floor Base (Fills any bottom space) ── */}
      <div className="absolute bottom-0 inset-x-0 h-[4vh] sm:h-[6vh] md:h-[8vh] bg-white z-0" />

      {/* ── Complete Hero Artwork (Blue Litter Hills, Peeking Cat & White Floor) ── */}
      {/* Mobile view (< md: 768px): Uses the vertical portrait artwork scaled so the cat is prominent and cute */}
      <div className="md:hidden absolute bottom-0 inset-x-0 h-[78vw] pointer-events-none z-10 overflow-hidden">
        <div
          className="absolute"
          style={{ width: "119vw", aspectRatio: "941 / 1672", left: "-14vw", bottom: "-4vw" }}
        >
          <Image
            src="/hero-cat-hills-mobile-v2.png"
            alt="Meow Ganics Litter Hills & Peeking Cat Mobile"
            fill
            sizes="119vw"
            className="object-contain"
            priority
          />
          <CatEyes art={EYES_MOBILE} id="cat-m" />
        </div>
      </div>

      {/* Laptop view (>= lg: 1024px): artwork scaled off viewport width so the cat stays locked
          at ~67vw (bag + cat centred as a group) with its paws ~12vh above the bottom edge on every laptop.
          Artwork is 1672x941 and the cat's paws sit at y=800 (141px above the image bottom). */}
      <div
        className="hidden lg:block absolute pointer-events-none z-10"
        style={{
          // 130vw wide; left keeps the cat centred at ~67vw (cat centre is 66.875% across the
          // artwork): 67 - 0.66875 * 130 = -20vw. The cat itself spans ~53-80vw.
          width: "130vw",
          aspectRatio: "1672 / 941",
          left: "-20vw",
          bottom: "calc(12vh - 130vw * 141 / 1672)",
        }}
      >
        <Image
          src="/hero-cat-hills-v2.png"
          alt="Meow Ganics Litter Hills & Peeking Cat"
          fill
          sizes="130vw"
          className="object-contain"
          priority
        />
        <CatEyes art={EYES_DESKTOP} id="cat-d" />
      </div>

      {/* Tablet view (md to lg): Uses the landscape artwork */}
      <div className="hidden md:flex lg:hidden absolute bottom-0 inset-x-0 w-full justify-center items-end pointer-events-none z-10 overflow-hidden">
        <div className="relative w-full aspect-[1672/941] min-h-[300px] md:min-h-[340px] max-h-[66vh] md:max-h-[74vh]">
          <Image
            src="/hero-cat-hills.png"
            alt="Meow Ganics Litter Hills & Peeking Cat"
            fill
            sizes="100vw"
            className="object-cover object-bottom w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
