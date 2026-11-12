"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    addToCart,
    clearCart,
  } = useCart();

  const [plan, setPlan] = useState<"onetime" | "yearly">("onetime");
  const [quantity, setQuantity] = useState<number>(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Sync state with CartContext on open / cart changes
  useEffect(() => {
    if (cart.length > 0) {
      const primary = cart[0];
      if (primary.isSubscription) {
        setPlan("yearly");
      } else {
        setPlan("onetime");
        if (primary.quantity > 0) {
          setQuantity(primary.quantity);
        }
      }
    }
  }, [cart, isOpen]);

  const handleUpdateQty = (delta: number) => {
    const nextQty = Math.max(1, quantity + delta);
    setQuantity(nextQty);
    if (plan === "onetime") {
      clearCart();
      addToCart(
        {
          productId: "clean-bean-original",
          name: "Clean Bean Tofu Cat Litter",
          size: { id: "standard", name: "7L Extra Free Pack", volume: "7L" },
          price: 19.99,
          image: "/showcase/meow/IMG_7598.PNG",
          quantity: nextQty,
          isSubscription: false,
        },
        false
      );
    }
  };

  const handleSelectPlan = (newPlan: "onetime" | "yearly") => {
    setPlan(newPlan);
    clearCart();
    if (newPlan === "yearly") {
      addToCart(
        {
          productId: "clean-bean-original",
          name: "Clean Bean Tofu Litter (Yearly Plan)",
          size: { id: "standard", name: "7L Monthly Auto-Refill", volume: "7L x 12" },
          price: 15.99,
          image: "/showcase/meow/IMG_7598.PNG",
          quantity: 1,
          isSubscription: true,
          subscriptionInterval: "Monthly",
        },
        false
      );
    } else {
      addToCart(
        {
          productId: "clean-bean-original",
          name: "Clean Bean Tofu Cat Litter",
          size: { id: "standard", name: "7L Extra Free Pack", volume: "7L" },
          price: 19.99,
          image: "/showcase/meow/IMG_7598.PNG",
          quantity: quantity,
          isSubscription: false,
        },
        false
      );
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const itemsPayload = [
        {
          productId: "clean-bean-original",
          name:
            plan === "yearly"
              ? "Clean Bean Tofu Litter (Yearly Plan)"
              : "Clean Bean Tofu Cat Litter",
          quantity: plan === "yearly" ? 1 : quantity,
          isSubscription: plan === "yearly",
          subscriptionInterval: plan === "yearly" ? "Monthly" : undefined,
          size: { id: "standard", name: "7L Extra Free Pack" },
        },
      ];

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsPayload }),
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

  const total = (19.99 * quantity).toFixed(2);

  const Radio = ({ active }: { active: boolean }) => (
    <div
      className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors bg-white ${active ? "border-black" : "border-black/45"
        }`}
    >
      {active && <div className="w-[10px] h-[10px] rounded-full bg-black" />}
    </div>
  );

  const rowClass = (active: boolean) =>
    `relative rounded-[18px] px-4 py-2.5 sm:py-3 cursor-pointer select-none border backdrop-blur-md transition-all duration-200 ${active
      ? "bg-white/70 border-black/70 shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
      : "bg-white/35 border-black/15 hover:bg-white/50"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Floating Panel */}
          <div className="absolute inset-0 min-[460px]:left-auto flex justify-center p-3 pointer-events-none">
            <motion.div
              data-lenis-prevent
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="w-full max-w-[420px] h-full bg-[#b9b9b9] text-black rounded-[36px] min-[460px]:rounded-[44px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/40 flex flex-col pointer-events-auto relative"
            >
              {/* Close Button (floats over image) */}
              <button
                onClick={closeCart}
                className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                data-lenis-prevent
                className="flex-1 overflow-y-auto overscroll-contain touch-pan-y flex flex-col"
              >
                {/* 1. Full-bleed Hero Image */}
                <div className="relative w-full flex-1 min-h-36 min-[460px]:flex-none min-[460px]:aspect-[4/4.4]">
                  <Image
                    src="/showcase/meow/IMG_7598.PNG"
                    alt="Clean Bean Tofu Cat Litter"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  {/* Darken behind the title */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
                  {/* Fade into the silver panel */}
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#d6d6d6] to-transparent" />

                  {/* Title block */}
                  <div className="absolute left-5 right-5 bottom-10 sm:bottom-14">
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

                {/* 2. Silver Content Area */}
                <div className="shrink-0 min-[460px]:flex-1 -mt-px bg-gradient-to-b from-[#d6d6d6] via-[#cbcbcb] to-[#b4b4b4] px-4 min-[380px]:px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-6 flex flex-col">
                  <p className="text-center text-[13px] font-semibold text-black/80 pt-2 mb-3 sm:mb-4 relative z-10">
                    Select your plan
                  </p>

                  {/* One-Time Purchase */}
                  <div onClick={() => handleSelectPlan("onetime")} className={rowClass(plan === "onetime")}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Radio active={plan === "onetime"} />
                        <div>
                          <div className="text-[15px] font-medium text-black">One-Time</div>
                          <div
                            className="flex items-center gap-2 mt-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center bg-black/[0.06] border border-black/15 rounded-full">
                              <button
                                onClick={() => handleUpdateQty(-1)}
                                disabled={quantity <= 1}
                                className="w-8 h-8 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-black/70 hover:text-black hover:bg-black/10 active:bg-black/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold text-sm cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-5 text-center font-semibold text-xs text-black select-none">
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(1)}
                                className="w-8 h-8 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-black/70 hover:text-black hover:bg-black/10 active:bg-black/15 transition-all font-bold text-sm cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-[10px] text-black/50">
                              {quantity === 1 ? "1 bag" : `${quantity} bags`}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[14px] font-semibold text-black">${total}</div>
                        <div className="text-[10px] text-black/50">$19.99 / bag</div>
                      </div>
                    </div>
                  </div>

                  {/* Yearly Plan */}
                  <div onClick={() => handleSelectPlan("yearly")} className={`${rowClass(plan === "yearly")} mt-4 sm:mt-5`}>
                    <div className="absolute -top-[11px] left-3 bg-black text-white text-[11px] font-bold px-2.5 py-[2px] rounded-full shadow-md">
                      Save 20%
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Radio active={plan === "yearly"} />
                        <div className="text-[15px] font-medium text-black">Yearly</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[14px] font-semibold text-black">
                          $15.99 <span className="font-normal text-black/70">/ month</span>
                        </div>
                        <div className="text-[10px] text-black/50">just $191.88 / year</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-4 sm:pt-7">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="block mx-auto w-[78%] sm:w-[86%] py-2.5 sm:py-3.5 rounded-full bg-black text-white font-semibold text-[13px] sm:text-[15px] hover:bg-black/85 active:scale-[0.98] transition-all duration-150 shadow-[0_6px_16px_rgba(0,0,0,0.25)] sm:shadow-[0_10px_25px_rgba(0,0,0,0.3)] cursor-pointer disabled:opacity-60"
                    >
                      {isCheckingOut ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : plan === "onetime" ? (
                        `Checkout • $${total}`
                      ) : (
                        "Subscribe"
                      )}
                    </button>

                    <p className="text-center text-[12px] min-[380px]:text-[13px] text-black/70 mt-2 sm:mt-3">
                      Cancel anytime • 30-Day Purr-fect Guarantee
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-[11px] text-black/45 mt-1.5">
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
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
