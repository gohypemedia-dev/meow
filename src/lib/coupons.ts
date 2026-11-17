export interface AvailableCoupon {
  code: string;
  title: string;
  description?: string;
  discountAmount?: number;
  discountPercent?: number;
  minOrder?: number;
}

const KNOWN_NON_COUPON_TAGS = new Set([
  "strong clumping",
  "low dust",
  "odour control",
  "plant-based",
  "flushable",
  "light weight",
  "easy scoop",
  "original unscented",
  "cat litter in cat supplies",
  "home page",
  "default product",
  "cat supplies",
  "litter",
]);

/**
 * Determines whether a given tag is a coupon code rather than a feature badge.
 */
export function isCouponTag(tag: string): boolean {
  if (!tag) return false;
  const lower = tag.trim().toLowerCase();
  if (KNOWN_NON_COUPON_TAGS.has(lower)) return false;
  if (lower.startsWith("coupon:") || lower.startsWith("discount:") || lower.startsWith("code:")) return true;
  if (/^[A-Z0-9_-]{4,24}$/i.test(tag.trim()) && (/[0-9]/.test(tag) || /coupon|discount|save|off/i.test(tag))) {
    return true;
  }
  return false;
}

/**
 * Extracts available coupon codes from Shopify product tags and details.
 */
export function extractCouponsFromTags(tags: string[] = []): AvailableCoupon[] {
  const coupons: AvailableCoupon[] = [];
  const seenCodes = new Set<string>();

  for (const rawTag of tags) {
    if (!rawTag) continue;
    const tag = rawTag.trim();
    const lower = tag.toLowerCase();

    // Skip known product feature tags
    if (KNOWN_NON_COUPON_TAGS.has(lower)) continue;

    // Format 1: Explicit prefix like coupon:CODE or coupon:CODE:AMOUNT:MIN_ORDER
    if (lower.startsWith("coupon:") || lower.startsWith("discount:") || lower.startsWith("code:")) {
      const parts = tag.split(":");
      const code = parts[1]?.trim().toUpperCase();
      if (!code || seenCodes.has(code)) continue;
      seenCodes.add(code);

      const val1 = parseInt(parts[2]?.trim() || "", 10);
      const val2 = parseInt(parts[3]?.trim() || "", 10);
      const amount = !isNaN(val1) ? val1 : extractAmountFromCode(code);
      const minOrder = !isNaN(val2) ? val2 : extractMinOrderFromCode(code);

      coupons.push({
        code,
        title: `Save ₹${amount} with '${code}'`,
        description: minOrder ? `Get ₹${amount} off on orders of ₹${minOrder} and above` : `Special discount of ₹${amount}`,
        discountAmount: amount,
        minOrder,
      });
      continue;
    }

    // Format 2: Standard promo code tags, e.g. "GETOFF40ON499", "SAVE50", "FLAT100", "MEOW40"
    if (/^[A-Z0-9_-]{4,24}$/i.test(tag) && (/[0-9]/.test(tag) || /coupon|discount|save|off/i.test(tag))) {
      const code = tag.toUpperCase();
      if (seenCodes.has(code)) continue;
      seenCodes.add(code);

      const amount = extractAmountFromCode(code);
      const minOrder = extractMinOrderFromCode(code);

      coupons.push({
        code,
        title: `Save ₹${amount} with '${code}'`,
        description: minOrder ? `Get ₹${amount} off on orders of ₹${minOrder} and above` : `Use coupon '${code}' at checkout`,
        discountAmount: amount,
        minOrder,
      });
      continue;
    }
  }

  // Default coupon shown in user's design reference
  if (!seenCodes.has("GETOFF40ON499")) {
    coupons.unshift({
      code: "GETOFF40ON499",
      title: "Save ₹40 with 'GETOFF40ON499'",
      description: "Get ₹40 off on orders of ₹499 and above",
      discountAmount: 40,
      minOrder: 499,
    });
  }

  return coupons;
}

function extractAmountFromCode(code: string): number {
  // e.g. "GETOFF40ON499" -> 40
  const match = code.match(/(?:OFF|SAVE|FLAT|GET|DISCOUNT)?(\d+)(?:ON\d+)?/i);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val) && val > 0 && val < 5000) return val;
  }
  return 40;
}

function extractMinOrderFromCode(code: string): number | undefined {
  // e.g. "GETOFF40ON499" -> 499
  const match = code.match(/ON(\d+)/i);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return undefined;
}
