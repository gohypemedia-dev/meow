"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useCleanBean, formatPrice } from "@/lib/useCleanBean";
import { extractCouponsFromTags, AvailableCoupon } from "@/lib/coupons";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    addToCart,
    clearCart,
  } = useCart();
  const cleanBean = useCleanBean();
  const fmt = (n: number) => formatPrice(n, cleanBean.currencyCode);

  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AvailableCoupon | null>(null);
  const [showAllCoupons, setShowAllCoupons] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Extract coupons dynamically from Shopify product tags
  const availableCoupons = useMemo(() => {
    return extractCouponsFromTags(cleanBean.tags);
  }, [cleanBean.tags]);

  // Featured coupon to display on the main card (first coupon, e.g. GETOFF40ON499)
  const featuredCoupon = availableCoupons[0] || {
    code: "GETOFF40ON499",
    title: "Save ₹40 with 'GETOFF40ON499'",
    description: "Get ₹40 off on orders of ₹499 and above",
    discountAmount: 40,
    minOrder: 499,
  };

  // Sync state with CartContext on open / cart changes
  useEffect(() => {
    if (cart.length > 0) {
      const primary = cart[0];
      if (primary.quantity > 0) {
        setQuantity(primary.quantity);
      }
    }
  }, [cart, isOpen]);

  const handleUpdateQty = (delta: number) => {
    const nextQty = Math.max(1, quantity + delta);
    setQuantity(nextQty);
    clearCart();
    addToCart(
      {
        productId: "clean-bean-original",
        name: cleanBean.name,
        size: { id: "standard", name: "7L Extra Free Pack", volume: "7L" },
        price: cleanBean.price,
        variantId: cleanBean.variantId,
        image: cleanBean.image,
        quantity: nextQty,
        isSubscription: false,
      },
      false
    );
  };

  const handleApplyCoupon = (coupon: AvailableCoupon) => {
    // Also copy code to clipboard so user has it for Shopify checkout
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(coupon.code).catch(() => {});
    }

    const subtotal = cleanBean.price * quantity;
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      setCouponMessage({
        text: `Add ₹${coupon.minOrder - subtotal} more to apply '${coupon.code}'`,
        isError: true,
      });
      return;
    }
    setAppliedCoupon(coupon);
    setCouponMessage({
      text: `'${coupon.code}' applied successfully!`,
      isError: false,
    });
    setShowAllCoupons(false);
  };

  const handleApplyCustomCode = () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) {
      setCouponMessage({ text: "Please enter a valid coupon code", isError: true });
      return;
    }

    // Check if matched in available coupons
    const matched = availableCoupons.find((c) => c.code.toUpperCase() === trimmed);
    if (matched) {
      handleApplyCoupon(matched);
      setCouponInput("");
      return;
    }

    // Allow custom coupon code to be passed through to Shopify checkout
    const customCoupon: AvailableCoupon = {
      code: trimmed,
      title: `Coupon '${trimmed}'`,
      discountAmount: 40,
    };
    handleApplyCoupon(customCoupon);
    setCouponInput("");
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const itemsPayload = [
        {
          productId: "clean-bean-original",
          name: cleanBean.name,
          quantity: quantity,
          isSubscription: false,
          size: { id: "standard", name: "7L Extra Free Pack" },
          variantId: cleanBean.variantId,
        },
      ];

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsPayload,
          discountCode: appliedCoupon ? appliedCoupon.code : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      alert(data.error || "Checkout is unavailable right now. Please try again.");
    } catch (e) {
      console.error(e);
      alert("Checkout connection error. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const subtotal = cleanBean.price * quantity;
  const discount = appliedCoupon ? appliedCoupon.discountAmount || 0 : 0;
  const finalPrice = Math.max(0, subtotal - discount);
  const totalFormatted = fmt(finalPrice);
  const subtotalFormatted = fmt(subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] overflow-hidden">
          {/* Backdrop - Frosted White Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-white/45 backdrop-blur-xl"
          />

          {/* Floating Panel */}
          <div className="absolute inset-0 min-[460px]:left-auto flex items-center justify-center min-[460px]:justify-end p-4 sm:p-6 pointer-events-none">
            <motion.div
              data-lenis-prevent
              initial={{ x: "110%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "110%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-[365px] sm:max-w-[390px] h-[82vh] max-h-[700px] bg-white/95 text-black rounded-[32px] sm:rounded-[38px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.25)] ring-1 ring-black/5 flex flex-col pointer-events-auto relative backdrop-blur-2xl"
            >
              {/* Close Button (floats over image) */}
              <button
                onClick={closeCart}
                className="absolute top-3.5 right-3.5 z-20 w-9 h-9 sm:w-8.5 sm:h-8.5 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto overscroll-contain touch-pan-y flex flex-col relative"
              >
                {/* 1. Full-bleed Hero Image */}
                <div className="relative w-full flex-1 min-h-36 min-[460px]:flex-none min-[460px]:aspect-[4/4.2]">
                  <Image
                    src="/showcase/meow/IMG_7598.PNG"
                    alt={cleanBean.name}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  {/* Darken behind the title */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
                  {/* Fade into the white panel */}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/95 to-transparent" />

                  {/* Title block */}
                  <div className="absolute left-5 right-5 bottom-6 sm:bottom-8">
                    <div className="inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full bg-black/35 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold mb-2">
                      <span>🌱</span>
                      <span>100% Organic Tofu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-[24px] min-[380px]:text-[28px] leading-none font-bold text-white tracking-tight drop-shadow-md">
                        Clean Bean
                      </h3>
                      <span className="w-[18px] h-[18px] rounded-full bg-white text-black flex items-center justify-center shadow">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. White Blur Content Area */}
                <div className="shrink-0 min-[460px]:flex-1 -mt-px bg-white/90 backdrop-blur-xl px-4 min-[380px]:px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 flex flex-col">
                  
                  {/* Quantity & Product Row */}
                  <div className="w-full rounded-[20px] bg-black/[0.03] border border-black/10 p-3 sm:p-3.5 mt-3 mb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[14px] font-semibold text-black tracking-tight">One-Time</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center bg-white border border-black/15 rounded-full shadow-xs">
                            <button
                              onClick={() => handleUpdateQty(-1)}
                              disabled={quantity <= 1}
                              className="w-7 h-7 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center text-black/70 hover:text-black hover:bg-black/5 active:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-black select-none">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(1)}
                              className="w-7 h-7 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center text-black/70 hover:text-black hover:bg-black/5 active:bg-black/10 transition-all font-bold text-sm cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[11px] font-medium text-black/50">
                            {quantity === 1 ? "1 bag" : `${quantity} bags`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[15px] sm:text-[16px] font-bold text-black tracking-tight">
                          {subtotalFormatted}
                        </div>
                        <div className="text-[10px] text-black/50">{fmt(cleanBean.price)} / bag</div>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Card (Exact Design from User Artwork Image 2) */}
                  <div className="w-full rounded-[18px] bg-white border border-black/12 p-3 sm:p-3.5 shadow-xs mb-3 transition-all hover:border-black/20">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="min-w-0 flex-1 pr-1">
                        <div className="text-[12px] sm:text-[13px] font-bold text-black tracking-tight leading-snug break-words">
                          {appliedCoupon
                            ? `Save ₹${appliedCoupon.discountAmount} with '${appliedCoupon.code}'`
                            : featuredCoupon.title}
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAllCoupons(true)}
                          className="text-[11px] sm:text-[12px] font-medium text-black/60 hover:text-black flex items-center gap-1 transition-colors cursor-pointer mt-0.5"
                        >
                          <span>View all coupons</span>
                          <span className="text-[#FF4D6D] text-[9px] font-bold">▶</span>
                        </button>
                      </div>

                      {/* Apply / Applied CTA Button */}
                      {appliedCoupon ? (
                        <button
                          type="button"
                          onClick={() => {
                            setAppliedCoupon(null);
                            setCouponMessage(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                          title="Click to remove coupon"
                        >
                          <span>✓ APPLIED</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon(featuredCoupon)}
                          className="px-3.5 py-1.5 rounded-lg border border-[#FF4D6D]/45 text-[#E11D48] hover:bg-[#FFF1F2] active:scale-95 transition-all text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer shrink-0"
                        >
                          APPLY
                        </button>
                      )}
                    </div>

                    {appliedCoupon && (
                      <div className="mt-2 pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                        <span>Discount applied</span>
                        <span>-₹{appliedCoupon.discountAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Feedback Message */}
                  {couponMessage && (
                    <div
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-xl mb-2.5 flex items-center justify-between ${
                        couponMessage.isError
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      <span>{couponMessage.text}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponMessage(null);
                        }}
                        className="text-xs ml-2 opacity-60 hover:opacity-100 cursor-pointer p-0.5"
                        title="Remove coupon"
                        aria-label="Remove coupon"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* CTA Checkout Button */}
                  <div className="mt-auto pt-2 sm:pt-4">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="block mx-auto w-full py-3 sm:py-3.5 rounded-full bg-black text-white font-semibold text-[13px] sm:text-[15px] hover:bg-black/85 active:scale-[0.98] transition-all duration-150 shadow-[0_6px_16px_rgba(0,0,0,0.25)] sm:shadow-[0_10px_25px_rgba(0,0,0,0.3)] cursor-pointer disabled:opacity-60"
                    >
                      {isCheckingOut ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        `Checkout • ${totalFormatted}`
                      )}
                    </button>

                    {/* Policy Links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-black/50 mt-3">
                      <Link href="/terms-and-conditions" onClick={closeCart} className="hover:text-black/80 transition-colors">
                        Terms of use
                      </Link>
                      <span>|</span>
                      <Link href="/privacy-policy" onClick={closeCart} className="hover:text-black/80 transition-colors">
                        Privacy policy
                      </Link>
                      <span>|</span>
                      <Link href="/return-and-refund-policy" onClick={closeCart} className="hover:text-black/80 transition-colors">
                        Refunds
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 3. Slide-up "View All Coupons" Modal Layer */}
                <AnimatePresence>
                  {showAllCoupons && (
                    <motion.div
                      initial={{ opacity: 0, y: "100%" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 280 }}
                      className="absolute inset-x-0 bottom-0 top-16 z-30 bg-white/95 backdrop-blur-2xl rounded-t-[28px] shadow-2xl flex flex-col p-4 sm:p-5 border-t border-black/10"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-black/10">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center text-xs font-bold">
                            %
                          </span>
                          <h4 className="font-heading font-bold text-base text-black">
                            Coupons & Offers
                          </h4>
                        </div>
                        <button
                          onClick={() => setShowAllCoupons(false)}
                          className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/70 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Custom Coupon Input */}
                      <div className="py-3.5">
                        <div className="flex items-center gap-2 bg-black/[0.04] border border-black/10 rounded-xl p-1 focus-within:border-black/40 transition-colors">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCustomCode()}
                            className="flex-1 bg-transparent px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-black placeholder:text-black/40 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCustomCode}
                            className="px-3.5 py-1.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-black/85 active:scale-95 transition-all cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>

                      {/* Available Coupons List */}
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                        <p className="text-[11px] font-semibold text-black/50 uppercase tracking-wider mb-1">
                          Available Coupons from Shopify
                        </p>
                        {availableCoupons.map((coupon) => {
                          const isApplied = appliedCoupon?.code === coupon.code;
                          return (
                            <div
                              key={coupon.code}
                              className={`rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all ${
                                isApplied
                                  ? "bg-emerald-50/70 border-emerald-300"
                                  : "bg-white border-black/10 hover:border-black/25"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="inline-block px-2 py-0.5 rounded-md border border-dashed border-[#FF4D6D] bg-[#FFF1F2] text-[#E11D48] font-mono text-[11px] font-black uppercase tracking-wider mb-1">
                                  {coupon.code}
                                </div>
                                <div className="text-xs font-bold text-black tracking-tight">
                                  {coupon.title}
                                </div>
                                {coupon.description && (
                                  <div className="text-[10px] text-black/55 mt-0.5">
                                    {coupon.description}
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => (isApplied ? setAppliedCoupon(null) : handleApplyCoupon(coupon))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shrink-0 cursor-pointer ${
                                  isApplied
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "border border-[#FF4D6D]/45 text-[#E11D48] hover:bg-[#FFF1F2] active:scale-95"
                                }`}
                              >
                                {isApplied ? "✓ APPLIED" : "APPLY"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
