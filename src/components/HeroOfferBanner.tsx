"use client";

import React from "react";
import Image from "next/image";
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
      className={`relative w-full max-w-[315px] xs:max-w-[340px] sm:max-w-[380px] md:max-w-[420px] lg:max-w-[455px] cursor-pointer pointer-events-auto select-none drop-shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:drop-shadow-[0_18px_36px_rgba(0,0,0,0.13)] transition-all ${className}`}
    >
      <div className="relative w-full aspect-[547/371]">
        <Image
          src="/hero-offer-banner-exact.png"
          alt="Limited Offer: Buy 2 At ₹999/- Save ₹721"
          fill
          priority
          sizes="(max-width: 640px) 340px, (max-width: 1024px) 420px, 460px"
          className="object-contain"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}
