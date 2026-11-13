import "server-only";
import { cache } from "react";
import { PRODUCTS, Product, ProductFlavor, ProductSize } from "@/data/products";
import {
  CatalogQueryResult,
  EnrichedProduct,
  EnrichedProductSize,
  GalleryMediaItem,
  SellingPlanOption,
  ShopifyCatalog,
  ShopifyProduct,
  ShopifyVariant,
} from "./types";
import { isShopifyConfigured, shopifyFetch } from "./client";

/** Revalidation interval (seconds) for caching Shopify catalog queries. */
const CATALOG_REVALIDATE_SECONDS = Number(
  process.env.SHOPIFY_REVALIDATE_SECONDS || 60
);

export const CATALOG_QUERY = /* GraphQL */ `
  query Catalog {
    shop {
      name
      paymentSettings {
        currencyCode
      }
    }
    products(first: 25) {
      nodes {
        id
        handle
        title
        descriptionHtml
        tags
        featuredImage {
          url
          altText
          width
          height
        }
        options {
          name
          optionValues {
            name
            swatch {
              color
            }
          }
        }
        media(first: 20) {
          nodes {
            mediaContentType
            alt
            previewImage {
              url
            }
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
            ... on Video {
              sources {
                url
                mimeType
                width
                height
              }
            }
          }
        }
        variants(first: 25) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            selectedOptions {
              name
              value
            }
            sellingPlanAllocations(first: 4) {
              nodes {
                sellingPlan {
                  id
                  name
                  options {
                    name
                    value
                  }
                }
                priceAdjustments {
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const toAmount = (value: string | undefined | null) => {
  const n = Number.parseFloat(value ?? "");
  return Number.isFinite(n) ? n : 0;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

const FLAVOR_OPTION_REGEX = /flavo?u?r|scent|type|variety|aroma/i;
const SIZE_OPTION_REGEX = /size|volume|pack|quantity|format|weight/i;

const optionValue = (variant: ShopifyVariant, pattern: RegExp) =>
  variant.selectedOptions.find((o) => pattern.test(o.name))?.value;

/** Extract gallery media (photos and videos) from Shopify product. */
function toGallery(product: ShopifyProduct): GalleryMediaItem[] {
  return product.media.nodes.flatMap((m): GalleryMediaItem[] => {
    const alt = m.alt || product.title;
    if (m.mediaContentType === "IMAGE") {
      const url = m.image?.url ?? m.previewImage?.url;
      return url
        ? [
            {
              type: "image",
              src: url,
              alt: m.image?.altText || alt,
              width: m.image?.width ?? undefined,
              height: m.image?.height ?? undefined,
            },
          ]
        : [];
    }
    if (m.mediaContentType === "VIDEO") {
      const mp4s = (m.sources ?? [])
        .filter((s) => s.mimeType === "video/mp4")
        .sort((a, b) => Math.abs(a.height - 720) - Math.abs(b.height - 720));
      const best = mp4s[0];
      return best
        ? [
            {
              type: "video",
              src: best.url,
              alt,
              poster: m.previewImage?.url,
              width: best.width,
              height: best.height,
            },
          ]
        : [];
    }
    return [];
  });
}

/** Resolves or creates a ProductFlavor from Shopify option value. */
function resolveFlavor(name: string, knownFlavors?: ProductFlavor[]): ProductFlavor {
  const clean = name.trim();
  const lower = clean.toLowerCase();

  const found = knownFlavors?.find(
    (f) =>
      f.name.toLowerCase() === lower ||
      f.id.toLowerCase() === lower ||
      lower.includes(f.id.toLowerCase())
  );
  if (found) return found;

  if (/peach/i.test(lower)) {
    return {
      id: "peach",
      name: clean,
      badge: "Sweet Aroma",
      color: "#EA580C",
      accentBg: "#FFEDD5",
      hueFilter: "hue-rotate(180deg)",
      description: "Refreshing natural summer peach extracts.",
      scentNotes: ["Ripe white peach", "Gentle blossom notes"],
    };
  }
  if (/tea|matcha/i.test(lower)) {
    return {
      id: "green-tea",
      name: clean,
      badge: "Active Catechins",
      color: "#059669",
      accentBg: "#D1FAE5",
      hueFilter: "hue-rotate(270deg)",
      description: "Fortified with natural green tea catechins.",
      scentNotes: ["Organic matcha essence", "Crisp herbal botanicals"],
    };
  }
  if (/berry/i.test(lower)) {
    return {
      id: "berry",
      name: clean,
      badge: "Odor Defense",
      color: "#DB2777",
      accentBg: "#FCE7F3",
      hueFilter: "hue-rotate(90deg)",
      description: "Natural wild berry botanicals that neutralize ammonia odors.",
      scentNotes: ["Wild raspberry extract", "Sweet blueberry aroma"],
    };
  }

  // Default / Unscented
  return {
    id: lower.replace(/[^a-z0-9]+/g, "-") || "original",
    name: clean,
    badge: "Pure & Natural",
    color: "#8FBEE5",
    accentBg: "#EBF4FC",
    hueFilter: "hue-rotate(0deg)",
    description: "Fragrance-free formula for sensitive feline noses.",
    scentNotes: ["Subtle natural soybean fiber", "Hypoallergenic"],
  };
}

/** Resolves or creates a ProductSize from Shopify variant. */
function resolveSize(variant: ShopifyVariant, knownSizes?: ProductSize[]): EnrichedProductSize {
  const rawSize = optionValue(variant, SIZE_OPTION_REGEX) || variant.title;
  const lower = rawSize.toLowerCase();

  const found = knownSizes?.find(
    (s) =>
      s.id.toLowerCase() === lower ||
      s.name.toLowerCase() === lower ||
      lower.includes(s.id.toLowerCase())
  );

  const price = toAmount(variant.price.amount);
  const compareAt = toAmount(variant.compareAtPrice?.amount);

  const sellingPlans: SellingPlanOption[] = variant.sellingPlanAllocations.nodes.map(
    (a) => ({
      id: a.sellingPlan.id,
      label: a.sellingPlan.options[0]?.value || a.sellingPlan.name,
      price: toAmount(a.priceAdjustments[0]?.price.amount),
    })
  );

  let volume = "Single Pack";
  let id = "standard";

  if (/6\s*l|single/i.test(lower)) {
    id = "6l";
    volume = "6 Liters (~2.5 kg)";
  } else if (/12\s*l|2[- ]?bag|duo/i.test(lower)) {
    id = "12l";
    volume = "12 Liters (~5.0 kg)";
  } else if (/18\s*l|3[- ]?bag|multi/i.test(lower)) {
    id = "18l";
    volume = "18 Liters (~7.5 kg)";
  } else if (found) {
    id = found.id;
    volume = found.volume;
  }

  return {
    id,
    name: found?.name || rawSize,
    volume,
    price: price || found?.price || 19.99,
    originalPrice: compareAt > price ? compareAt : found?.originalPrice,
    popular: found?.popular ?? id === "12l",
    savingsBadge: found?.savingsBadge,
    variantId: variant.id,
    available: variant.availableForSale,
    sellingPlans,
    subscribePrice: sellingPlans[0]?.price,
  };
}

/**
 * Builds the enriched storefront catalog by merging Shopify live store data
 * with rich local UI metadata (descriptions, benefits, ingredients, reviews, FAQs).
 */
export function buildCatalog(data: CatalogQueryResult): ShopifyCatalog {
  const currencyCode = data.shop?.paymentSettings?.currencyCode || "USD";
  const shopifyProducts = data.products.nodes;

  const enrichedProducts: EnrichedProduct[] = [];

  for (const shopifyProd of shopifyProducts) {
    // Match against local products by handle first (stable even when the product is
    // renamed in Shopify, e.g. "clean-bean-tofu-litter" → local "clean-bean"), then by title.
    const handle = shopifyProd.handle.toLowerCase();
    const localMatch = PRODUCTS.find(
      (p) =>
        p.slug.toLowerCase() === handle ||
        p.id.toLowerCase() === handle ||
        handle.startsWith(`${p.slug.toLowerCase()}-`) ||
        shopifyProd.title.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(shopifyProd.title.toLowerCase())
    );

    const baseProduct: Product = localMatch ?? {
      id: shopifyProd.handle,
      slug: shopifyProd.handle,
      name: shopifyProd.title,
      subtitle: "Premium Natural Pet Care",
      tagline: "Eco-friendly, chemical-free, and crafted for maximum feline wellness.",
      basePrice: toAmount(shopifyProd.variants.nodes[0]?.price?.amount) || 19.99,
      rating: 4.9,
      reviewCount: 120,
      image: shopifyProd.featuredImage?.url || "/product-bag.png",
      badge: "Shopify Official",
      category: "litter",
      description: shopifyProd.descriptionHtml?.replace(/<[^>]+>/g, "").slice(0, 200) || "",
      longDescription: shopifyProd.descriptionHtml || "",
      sizes: [],
      features: [
        "100% natural, biodegradable ingredients",
        "Fast-acting clumping and odor absorption",
        "Safe and gentle for sensitive paws",
      ],
      benefits: [
        { title: "Plant-Based", desc: "Non-toxic and safe for all cat breeds.", icon: "🌱" },
        { title: "Dust-Free", desc: "Guards delicate respiratory systems.", icon: "💨" },
      ],
      ingredients: [{ name: "Organic Soybean Fiber", percentage: "100%", purpose: "Base clumping fiber" }],
      usageSteps: [{ step: 1, title: "Fill", instruction: "Fill litter box to 2-3 inches deep." }],
      faqs: [{ question: "How often should I change it?", answer: "Scoop daily, refresh full box every 3-4 weeks." }],
      reviews: [],
    };

    // Extract flavors from variant options
    const rawFlavors = Array.from(
      new Set(
        shopifyProd.variants.nodes
          .map((v) => optionValue(v, FLAVOR_OPTION_REGEX))
          .filter((f): f is string => Boolean(f))
      )
    );

    const flavors =
      rawFlavors.length > 0
        ? rawFlavors.map((name) => resolveFlavor(name, baseProduct.flavors))
        : baseProduct.flavors;

    // Extract sizes & live variant details
    const sizes: EnrichedProductSize[] = shopifyProd.variants.nodes.map((variant) =>
      resolveSize(variant, baseProduct.sizes)
    );

    // Filter unique sizes by id (keep first)
    const uniqueSizes = sizes.filter(
      (s, idx, arr) => arr.findIndex((x) => x.id === s.id) === idx
    );

    const gallery = toGallery(shopifyProd);
    const available = shopifyProd.variants.nodes.some((v) => v.availableForSale);
    const lowestPrice = Math.min(...sizes.map((s) => s.price));

    // Shopify's description is the source of truth whenever the merchant has written one.
    const shopifyDescriptionText = (shopifyProd.descriptionHtml || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    enrichedProducts.push({
      ...baseProduct,
      shopifyId: shopifyProd.id,
      handle: shopifyProd.handle,
      name: shopifyProd.title || baseProduct.name,
      description: shopifyDescriptionText || baseProduct.description,
      longDescription: shopifyProd.descriptionHtml || baseProduct.longDescription,
      tags: shopifyProd.tags ?? [],
      basePrice: lowestPrice > 0 ? lowestPrice : baseProduct.basePrice,
      image: shopifyProd.featuredImage?.url || baseProduct.image,
      flavors: flavors && flavors.length > 0 ? flavors : undefined,
      sizes: uniqueSizes.length > 0 ? uniqueSizes : baseProduct.sizes.map((s) => ({ ...s, available: true })),
      gallery: gallery.length > 0 ? gallery : undefined,
      available,
      currencyCode,
    });
  }

  // If some local products are not yet in Shopify, include them as fallbacks
  for (const local of PRODUCTS) {
    if (!enrichedProducts.some((p) => p.slug === local.slug || p.id === local.id)) {
      enrichedProducts.push({
        ...local,
        sizes: local.sizes.map((s) => ({ ...s, available: true })),
        available: true,
        currencyCode,
      });
    }
  }

  const mainProduct =
    enrichedProducts.find((p) => p.slug === "clean-bean" || p.id === "clean-bean") ||
    enrichedProducts[0];

  return {
    source: "shopify",
    currencyCode,
    products: enrichedProducts,
    mainProduct,
  };
}

/**
 * Builds the fallback catalog using local data files so the site functions
 * 100% offline or while Shopify credentials are being set up.
 */
export function buildLocalCatalog(): ShopifyCatalog {
  const enrichedProducts: EnrichedProduct[] = PRODUCTS.map((p) => ({
    ...p,
    available: true,
    currencyCode: "USD",
    sizes: p.sizes.map((s) => ({
      ...s,
      available: true,
    })),
  }));

  return {
    source: "local",
    currencyCode: "USD",
    products: enrichedProducts,
    mainProduct: enrichedProducts[0],
  };
}

/**
 * Returns the storefront catalog.
 * Reads from Shopify Storefront API with Next.js tag-based revalidation caching,
 * falling back reliably to local static data if Shopify cannot be reached.
 */
export const getCatalog = cache(async (): Promise<ShopifyCatalog> => {
  if (!isShopifyConfigured) {
    return buildLocalCatalog();
  }

  try {
    const data = await shopifyFetch<CatalogQueryResult>(CATALOG_QUERY, {
      revalidate: CATALOG_REVALIDATE_SECONDS,
      tags: ["shopify-catalog"],
    });

    if (!data.products?.nodes || data.products.nodes.length === 0) {
      console.warn(
        "[shopify] Storefront returned 0 products; using local catalog fallback."
      );
      return buildLocalCatalog();
    }

    return buildCatalog(data);
  } catch (error) {
    console.error(
      "[shopify] Could not load live Shopify catalog; falling back to local data.",
      error
    );
    return buildLocalCatalog();
  }
});

/**
 * Returns a single product by handle, slug, or id.
 */
export const getProduct = cache(
  async (slugOrId: string): Promise<EnrichedProduct | null> => {
    const catalog = await getCatalog();
    return (
      catalog.products.find(
        (p) =>
          p.slug.toLowerCase() === slugOrId.toLowerCase() ||
          p.id.toLowerCase() === slugOrId.toLowerCase() ||
          p.handle?.toLowerCase() === slugOrId.toLowerCase()
      ) ?? null
    );
  }
);

