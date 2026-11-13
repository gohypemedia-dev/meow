import { Product, ProductFlavor, ProductSize } from "@/data/products";

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ShopifyMediaSource {
  url: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface ShopifyMedia {
  mediaContentType: "IMAGE" | "VIDEO" | "EXTERNAL_VIDEO" | "MODEL_3D";
  alt: string | null;
  previewImage: { url: string } | null;
  image?: (ShopifyImage & { width: number | null; height: number | null }) | null;
  sources?: ShopifyMediaSource[];
}

export interface ShopifySellingPlanOption {
  name: string;
  value: string;
}

export interface ShopifySellingPlan {
  id: string;
  name: string;
  options: ShopifySellingPlanOption[];
}

export interface ShopifyPriceAdjustment {
  price: { amount: string };
}

export interface ShopifySellingPlanAllocation {
  sellingPlan: ShopifySellingPlan;
  priceAdjustments: ShopifyPriceAdjustment[];
}

export interface ShopifyVariantOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  image: ShopifyImage | null;
  selectedOptions: ShopifyVariantOption[];
  sellingPlanAllocations: {
    nodes: ShopifySellingPlanAllocation[];
  };
}

export interface ShopifyProductOptionValue {
  name: string;
  swatch?: { color: string | null } | null;
}

export interface ShopifyProductOption {
  name: string;
  optionValues: ShopifyProductOptionValue[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  tags?: string[];
  featuredImage: ShopifyImage | null;
  options: ShopifyProductOption[];
  media: { nodes: ShopifyMedia[] };
  variants: { nodes: ShopifyVariant[] };
}

export interface CatalogQueryResult {
  shop: {
    name?: string;
    paymentSettings: { currencyCode: string };
  };
  products: {
    nodes: ShopifyProduct[];
  };
}

export interface GalleryMediaItem {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  width?: number;
  height?: number;
}

export interface SellingPlanOption {
  id: string;
  label: string;
  price: number;
}

export interface EnrichedProductSize extends ProductSize {
  variantId?: string;
  available?: boolean;
  sellingPlans?: SellingPlanOption[];
  subscribePrice?: number;
}

export interface EnrichedProduct extends Product {
  shopifyId?: string;
  handle?: string;
  currencyCode?: string;
  available?: boolean;
  sizes: EnrichedProductSize[];
  gallery?: GalleryMediaItem[];
  /** Product tags from Shopify, shown as feature chips. */
  tags?: string[];
}

export interface ShopifyCatalog {
  source: "shopify" | "local";
  currencyCode: string;
  products: EnrichedProduct[];
  mainProduct?: EnrichedProduct;
}

