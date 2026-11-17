import { NextResponse } from "next/server";
import { isShopifyConfigured, createShopifyCart, CartLineInput } from "@/lib/shopify/client";
import { getCatalog } from "@/lib/shopify/catalog";

interface CheckoutRequestBody {
  items: Array<{
    id?: string;
    productId: string;
    variantId?: string;
    quantity: number;
    size?: { id: string; name: string };
    flavor?: { id: string; name: string };
    isSubscription?: boolean;
    subscriptionInterval?: string;
  }>;
  discountCode?: string;
}

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    "wr7cuz-21.myshopify.com";
  const cleanDomain = storeDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const fallbackCheckoutUrl = `https://${cleanDomain}/checkout`;

  try {
    const body = (await req.json()) as CheckoutRequestBody;
    const { items, discountCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty", checkoutUrl: fallbackCheckoutUrl },
        { status: 400 }
      );
    }

    if (!isShopifyConfigured) {
      return NextResponse.json({
        success: true,
        checkoutUrl: fallbackCheckoutUrl,
      });
    }

    const catalog = await getCatalog();

    // Grab first available variant from Shopify if any product exists
    const firstAvailableVariant = catalog.products[0]?.sizes[0]?.variantId;

    // Map each cart item to a valid Shopify variant ID
    const lines: CartLineInput[] = [];

    for (const item of items) {
      let variantId = item.variantId;

      if (!variantId) {
        // Find matching product in catalog
        const product = catalog.products.find(
          (p) =>
            p.id === item.productId ||
            p.slug === item.productId ||
            p.handle === item.productId
        );

        if (product) {
          const matchedSize = product.sizes.find(
            (s) => s.id === item.size?.id || s.name === item.size?.name
          );
          variantId = matchedSize?.variantId || product.sizes[0]?.variantId;
        } else if (firstAvailableVariant) {
          variantId = firstAvailableVariant;
        }
      }

      if (variantId) {
        lines.push({
          merchandiseId: variantId,
          quantity: item.quantity,
        });
      }
    }

    // No purchasable Shopify variant found → an empty cart's checkout just
    // redirects to the store homepage, so fail loudly instead.
    if (lines.length === 0) {
      console.error(
        "[api/checkout] No Shopify variants found. Is the product created and published to the Headless/Storefront sales channel?"
      );
      return NextResponse.json(
        {
          success: false,
          error: "This product isn't available for checkout yet. Please try again shortly.",
        },
        { status: 422 }
      );
    }

    const discountCodes = discountCode ? [discountCode] : undefined;

    // If we have variant lines, also build a Shopify cart permalink fallback
    let permalinkUrl = fallbackCheckoutUrl;
    if (lines.length > 0) {
      const parts = lines.map((l) => {
        const numId = l.merchandiseId.split("/").pop();
        return `${numId}:${l.quantity}`;
      });
      const discParam = discountCode ? `?discount=${encodeURIComponent(discountCode)}` : "";
      permalinkUrl = `https://${cleanDomain}/cart/${parts.join(",")}${discParam}`;
    }

    try {
      const cart = await createShopifyCart(lines, discountCodes);
      if (!cart.totalQuantity) {
        throw new Error("Shopify returned an empty cart (variant unavailable or out of stock)");
      }
      let finalCheckoutUrl = cart.checkoutUrl || permalinkUrl;
      if (discountCode && finalCheckoutUrl && !finalCheckoutUrl.includes("discount=")) {
        const sep = finalCheckoutUrl.includes("?") ? "&" : "?";
        finalCheckoutUrl = `${finalCheckoutUrl}${sep}discount=${encodeURIComponent(discountCode)}`;
      }
      return NextResponse.json({
        success: true,
        checkoutUrl: finalCheckoutUrl,
        cartId: cart.id,
        totalQuantity: cart.totalQuantity,
      });
    } catch (cartError) {
      console.warn("[api/checkout] CartCreate warning, using permalink/checkout URL:", cartError);
      return NextResponse.json({
        success: true,
        checkoutUrl: permalinkUrl,
      });
    }
  } catch (error) {
    console.error("[api/checkout] Error generating Shopify checkout:", error);
    return NextResponse.json({
      success: true,
      checkoutUrl: fallbackCheckoutUrl,
    });
  }
}
