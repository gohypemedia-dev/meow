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
      className={`relative w-full max-w-none sm:max-w-[380px] md:max-w-[420px] lg:max-w-[840px] cursor-pointer pointer-events-auto select-none ${className}`}
    >
      {/* Vector banner: stays sharp at any screen size / pixel density. */}
      <svg
        viewBox="0 0 547 371"
        className="block w-full h-auto"
        role="img"
        aria-label="Limited Offer: Buy 2 At ₹999/- Save ₹721"
        style={{ fontFamily: "var(--font-fredoka), 'Nunito Sans', sans-serif" }}
      >
        {/* Squircle card (superellipse, n=3.6): continuous curve with big soft corners and no straight
            runs; the top edge tilts up slightly to the right for a hand-drawn feel. */}
        <path
          d="M541.5 186 C541.5 202.5 541.3 222.6 540.8 234.4 C540.3 246.3 539.6 250.3 538.6 257 C537.7 263.7 536.5 269.2 535 274.6 C533.6 279.9 531.9 284.7 530 289.3 C528 293.9 525.9 298 523.4 302 C521 306 518.3 309.7 515.4 313.2 C512.4 316.7 509.3 319.9 505.8 323 C502.3 326.1 498.6 328.9 494.6 331.6 C490.5 334.3 486.3 336.8 481.6 339.1 C477 341.5 472.1 343.6 466.8 345.6 C461.6 347.6 456 349.4 450 351.1 C443.9 352.8 437.6 354.3 430.7 355.6 C423.7 357 416.5 358.2 408.3 359.2 C400.1 360.2 391.8 361.1 381.6 361.9 C371.4 362.6 365.3 363.2 347.2 363.7 C329.2 364.2 298.1 364.7 273.5 365 C248.9 365.3 217.8 365.5 199.8 365.3 C181.7 365.2 175.6 364.8 165.4 364.3 C155.2 363.7 146.9 363 138.7 362.1 C130.5 361.3 123.3 360.2 116.3 359 C109.4 357.8 103.1 356.4 97 354.8 C91 353.2 85.4 351.4 80.2 349.5 C74.9 347.6 70 345.5 65.4 343.2 C60.7 340.9 56.5 338.4 52.4 335.7 C48.4 333 44.7 330.1 41.2 327 C37.7 323.9 34.6 320.6 31.6 317.1 C28.7 313.5 26 309.8 23.6 305.7 C21.1 301.6 19 297.4 17 292.7 C15.1 288 13.4 283.1 12 277.5 C10.5 272 9.3 266.3 8.4 259.4 C7.4 252.5 6.7 248.3 6.2 236.1 C5.7 223.8 5.5 202.4 5.5 186 C5.5 169.6 5.7 149.6 6.2 137.8 C6.7 126.1 7.4 122 8.4 115.4 C9.3 108.7 10.5 103.3 12 97.9 C13.4 92.6 15.1 87.8 17 83.3 C19 78.7 21.1 74.6 23.6 70.6 C26 66.6 28.7 63 31.6 59.5 C34.6 56 37.7 52.7 41.2 49.7 C44.7 46.6 48.4 43.8 52.4 41.1 C56.5 38.4 60.7 35.9 65.4 33.5 C70 31.2 74.9 29.1 80.2 27 C85.4 25 91 23.2 97 21.5 C103.1 19.8 109.4 18.3 116.3 16.9 C123.3 15.6 130.5 14.4 138.7 13.3 C146.9 12.2 155.2 11.3 165.4 10.5 C175.6 9.7 181.7 9.2 199.8 8.6 C217.8 8 248.9 7.4 273.5 7 C298.1 6.6 329.2 6.3 347.2 6.4 C365.3 6.4 371.4 6.8 381.6 7.3 C391.8 7.8 400.1 8.5 408.3 9.4 C416.5 10.2 423.7 11.2 430.7 12.5 C437.6 13.7 443.9 15 450 16.6 C456 18.2 461.6 19.9 466.8 21.8 C472.1 23.8 477 25.9 481.6 28.2 C486.3 30.5 490.5 32.9 494.6 35.6 C498.6 38.3 502.3 41.2 505.8 44.3 C509.3 47.4 512.4 50.7 515.4 54.3 C518.3 57.8 521 61.6 523.4 65.7 C525.9 69.8 528 74.1 530 78.8 C531.9 83.5 533.6 88.4 535 94 C536.5 99.6 537.7 105.3 538.6 112.2 C539.6 119.1 540.3 123.3 540.8 135.6 C541.3 147.9 541.5 169.5 541.5 186 Z"
          fill="#FBF4EC"
          stroke="#161616"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <text x="273.5" y="62" textAnchor="middle" fontSize="24" fontWeight="600" letterSpacing="6" fill="#161616">
          LIMITED OFFER
        </text>

        {/* Chunky headline: a matching stroke thickens the letters */}
        <text
          x="273.5"
          y="132"
          textAnchor="middle"
          fontSize="70"
          fontWeight="700"
          letterSpacing="1"
          fill="#161616"
          stroke="#161616"
          strokeWidth="2.5"
          strokeLinejoin="round"
        >
          BUY 2 AT
        </text>
        {/* Hand-drawn underline */}
        <path d="M196 148 Q262 138 330 145" fill="none" stroke="#E6175C" strokeWidth="6" strokeLinecap="round" />

        {/* Burst strokes */}
        <g stroke="#E6175C" strokeWidth="5" strokeLinecap="round">
          <line x1="36" y1="172" x2="64" y2="186" />
          <line x1="30" y1="206" x2="62" y2="206" />
          <line x1="36" y1="240" x2="64" y2="226" />
          <line x1="511" y1="172" x2="483" y2="186" />
          <line x1="517" y1="206" x2="485" y2="206" />
          <line x1="511" y1="240" x2="483" y2="226" />
        </g>

        {/* Big price pill */}
        <rect x="80" y="160" width="387" height="92" rx="46" fill="#E6175C" />
        <text x="273.5" y="235" textAnchor="middle" fontSize="84" fontWeight="700" fill="#FFFFFF">
          ₹999/-
        </text>

        {/* Savings highlighter swash */}
        <path
          d="M160 266 C220 261 330 261 388 265 L384 280 L390 296 C330 300 220 300 158 297 L164 281 Z"
          fill="#F8B8CC"
        />
        <text x="273.5" y="291" textAnchor="middle" fontSize="28" fontWeight="700" letterSpacing="1" fill="#161616">
          SAVE ₹721
        </text>

        {/* Thin divider above the footer row */}
        <line x1="60" y1="310" x2="487" y2="310" stroke="#161616" strokeOpacity="0.4" strokeWidth="1.5" />

        {/* Footer row */}
        <g fontSize="14" fontWeight="600" letterSpacing="2" fill="#161616" textAnchor="middle">
          <text x="103" y="334">2 PACKS</text>
          <text x="250" y="334">GREAT VALUE</text>
          <text x="420" y="334">HASSLE FREE</text>
        </g>
        <g stroke="#161616" strokeWidth="2" strokeLinecap="round">
          <line x1="165" y1="320" x2="165" y2="338" />
          <line x1="335" y1="320" x2="335" y2="338" />
        </g>
      </svg>
    </motion.div>
  );
}
