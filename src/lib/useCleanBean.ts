"use client";

import { useEffect, useState } from "react";

/**
 * Live Clean Bean product data from Shopify (via /api/catalog).
 * Fetched once per page load and shared by every component that calls the hook.
 * Until Shopify answers (or if it can't be reached) the fallbacks below are used.
 */
export interface CleanBeanData {
  name: string;
  description: string;
  /** Selling price per pack (Shopify variant price). */
  price: number;
  /** MRP / compare-at price, if set in Shopify. */
  compareAtPrice?: number;
  /** Subscription price per pack (Shopify selling plan, else the site's subscription offer). */
  subscribePrice: number;
  image: string;
  variantId?: string;
  currencyCode: string;
  available: boolean;
  fromShopify: boolean;
}

/** Subscription offer used when the Shopify product has no selling plan. */
const SUBSCRIBE_PRICE_FALLBACK = 590;

export const CLEAN_BEAN_FALLBACK: CleanBeanData = {
  name: "Clean Bean Tofu Litter",
  description:
    "Made with natural tofu-based ingredients, CleanBean creates a cleaner, more comfortable litter experience for your cat and a fresher home for you.",
  price: 860,
  compareAtPrice: 860,
  subscribePrice: SUBSCRIBE_PRICE_FALLBACK,
  image: "/showcase/meow/IMG_7598.PNG",
  currencyCode: "INR",
  available: true,
  fromShopify: false,
};

let pending: Promise<CleanBeanData> | null = null;

function loadCleanBean(): Promise<CleanBeanData> {
  if (!pending) {
    pending = fetch("/api/catalog?slug=clean-bean")
      .then((res) => (res.ok ? res.json() : null))
      .then((data): CleanBeanData => {
        const p = data?.product;
        if (!p || !p.shopifyId) return CLEAN_BEAN_FALLBACK;
        const size = p.sizes?.find((s: { available?: boolean }) => s.available !== false) ?? p.sizes?.[0];
        const price = Number(size?.price) || CLEAN_BEAN_FALLBACK.price;
        return {
          name: p.name || CLEAN_BEAN_FALLBACK.name,
          description: p.description || CLEAN_BEAN_FALLBACK.description,
          price,
          compareAtPrice: size?.originalPrice && size.originalPrice > price ? size.originalPrice : undefined,
          subscribePrice: Number(size?.subscribePrice) || SUBSCRIBE_PRICE_FALLBACK,
          image: p.image || CLEAN_BEAN_FALLBACK.image,
          variantId: size?.variantId,
          currencyCode: p.currencyCode || "INR",
          available: p.available !== false,
          fromShopify: true,
        };
      })
      .catch(() => {
        pending = null; // allow a retry on the next mount
        return CLEAN_BEAN_FALLBACK;
      });
  }
  return pending;
}

export function useCleanBean(): CleanBeanData {
  const [data, setData] = useState<CleanBeanData>(CLEAN_BEAN_FALLBACK);
  useEffect(() => {
    let alive = true;
    loadCleanBean().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

/** Formats an amount in the store currency, e.g. 860 → "₹860", 19.5 → "₹19.50". */
export function formatPrice(amount: number, currencyCode = "INR"): string {
  const whole = Number.isInteger(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
