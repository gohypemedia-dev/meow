"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface HeroOfferBannerProps {
  onAction?: () => void;
  className?: string;
}

export default function HeroOfferBanner({ onAction, className = "" }: HeroOfferBannerProps) {
  const { addToCart, openCart } = useCart();

  const handleBannerClick = () => {
    if (onAction) {
      onAction();
    } else {
      addToCart(
        {
          productId: "clean-bean-2-pack-offer",
          name: "Clean Bean Tofu Cat Litter (Buy 2 Bundle)",
          price: 999,
          originalPrice: 1720,
          size: { id: "bundle-2", name: "2 × (6+1)L Extra Free Packs", volume: "14L" },
          image: "/showcase/meow/IMG_7598.PNG",
          quantity: 1,
        },
        true
      );
      openCart();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleBannerClick}
      className={`relative w-full max-w-none sm:max-w-[380px] md:max-w-[420px] lg:max-w-[455px] cursor-pointer pointer-events-auto select-none ${className}`}
    >
      {/* Vector banner: stays sharp at any screen size / pixel density. */}
      <svg
        viewBox="0 0 547 371"
        className="block w-full h-auto"
        role="img"
        aria-label="Limited Offer: Buy 2 At ₹999/- Save ₹721"
        style={{ fontFamily: "var(--font-fredoka), 'Nunito Sans', sans-serif" }}
      >
        {/* Organic card shape */}
        <path
          d="M78 22 C190 4 357 4 469 22 C528 32 541 84 541 150 L541 222 C541 300 526 342 466 351 C356 367 191 367 81 351 C21 342 6 300 6 222 L6 150 C6 84 19 32 78 22 Z"
          fill="#FBF4EC"
          stroke="#161616"
          strokeWidth="3"
        />

        <text x="273.5" y="64" textAnchor="middle" fontSize="25" fontWeight="600" letterSpacing="6" fill="#161616">
          LIMITED OFFER
        </text>

        <text x="273.5" y="136" textAnchor="middle" fontSize="66" fontWeight="700" letterSpacing="1" fill="#161616">
          BUY 2 AT
        </text>
        {/* Hand-drawn underline */}
        <path d="M186 152 Q254 141 322 149" fill="none" stroke="#E6175C" strokeWidth="5" strokeLinecap="round" />

        {/* Burst strokes */}
        <g stroke="#E6175C" strokeWidth="4.5" strokeLinecap="round">
          <line x1="60" y1="176" x2="84" y2="188" />
          <line x1="48" y1="210" x2="76" y2="210" />
          <line x1="60" y1="244" x2="84" y2="232" />
          <line x1="487" y1="176" x2="463" y2="188" />
          <line x1="499" y1="210" x2="471" y2="210" />
          <line x1="487" y1="244" x2="463" y2="232" />
        </g>

        {/* Price pill */}
        <rect x="96" y="164" width="355" height="92" rx="46" fill="#E6175C" />
        <text x="273.5" y="236" textAnchor="middle" fontSize="80" fontWeight="700" fill="#FFFFFF">
          ₹999/-
        </text>

        {/* Savings ribbon */}
        <path d="M168 266 L379 266 L371 285 L379 304 L168 304 L176 285 Z" fill="#F8B8CC" />
        <text x="273.5" y="295" textAnchor="middle" fontSize="27" fontWeight="700" letterSpacing="1" fill="#161616">
          SAVE ₹721
        </text>

        {/* Footer row */}
        <g fontSize="13" fontWeight="600" letterSpacing="2.5" fill="#161616" textAnchor="middle">
          <text x="132" y="336">2 PACKS</text>
          <text x="254.5" y="336">GREAT VALUE</text>
          <text x="397.5" y="336">HASSLE FREE</text>
        </g>
        <g stroke="#161616" strokeWidth="2" strokeLinecap="round">
          <line x1="181.5" y1="323" x2="181.5" y2="339" />
          <line x1="324.5" y1="323" x2="324.5" y2="339" />
        </g>
      </svg>
    </motion.div>
  );
}
