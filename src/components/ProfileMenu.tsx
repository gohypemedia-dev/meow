"use client";

import React from "react";
import { motion } from "framer-motion";
import ProfileIcon from "@/components/ProfileIcon";

interface ProfileMenuProps {
  theme?: "frameless" | "brutalist" | "glass-dark" | "glass-light";
  dropdownAlign?: "left" | "right";
  className?: string;
  iconClassName?: string;
}

export default function ProfileMenu({
  theme = "frameless",
  className = "",
  iconClassName = "w-7 h-7 md:w-8 md:h-8",
}: ProfileMenuProps) {
  const rawDomain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    "wr7cuz-21.myshopify.com";

  const domain = rawDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  // Using direct profile endpoint with return_to parameter so Shopify opens the Profile tab
  const loginUrl = `https://${domain}/account?return_to=%2Faccount%2Fprofile`;

  const isFrameless = theme === "frameless";
  const isBrutalist = theme === "brutalist";
  const isGlassDark = theme === "glass-dark";

  const buttonStyle = isFrameless
    ? "p-0 md:p-1 hover:scale-110 active:scale-95 transition-transform text-inherit"
    : isBrutalist
    ? "bg-brand-white text-brand-black rounded-2xl border-[3px] border-brand-black shadow-[3px_3px_0px_#111111] hover:shadow-[1px_1px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px]"
    : isGlassDark
    ? "bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 backdrop-blur-md shadow-md"
    : "bg-white/90 hover:bg-white text-brand-black rounded-full border border-black/15 shadow-[0_4px_16px_rgba(0,0,0,0.14)]";

  return (
    <a
      href={loginUrl}
      aria-label="Shopify Customer Login"
      title="Login to your Shopify account"
      className={`relative inline-flex items-center justify-center cursor-pointer select-none group ${buttonStyle} ${className}`}
    >
      <motion.div
        whileHover={{ rotate: [-3, 4, -3, 0], scale: 1.08 }}
        transition={{ duration: 0.3 }}
        className="relative flex items-center justify-center"
      >
        <ProfileIcon className={iconClassName} />
      </motion.div>
    </a>
  );
}
