const rawDomain =
  process.env.SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  "";

// Clean domain by stripping protocol and slashes
export const SHOPIFY_STORE_DOMAIN = rawDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

export const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  "";

export const SHOPIFY_PRIVATE_ACCESS_TOKEN =
  process.env.SHOPIFY_PRIVATE_ACCESS_TOKEN || "";

export const SHOPIFY_API_VERSION =
  process.env.SHOPIFY_API_VERSION || "2025-01";

export const isShopifyConfigured = Boolean(
  SHOPIFY_STORE_DOMAIN &&
  (SHOPIFY_PRIVATE_ACCESS_TOKEN || SHOPIFY_STOREFRONT_ACCESS_TOKEN) &&
  !SHOPIFY_STORE_DOMAIN.includes("your-store.myshopify.com")
);

export interface ShopifyFetchOptions {
  variables?: Record<string, unknown>;
  revalidate?: number;
  tags?: string[];
  cache?: RequestCache;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; locations?: unknown[]; path?: unknown[] }[];
}

/**
 * Execute a GraphQL query or mutation against Shopify's Storefront API.
 */
export async function shopifyFetch<T>(
  query: string,
  options: ShopifyFetchOptions = {}
): Promise<T> {
  if (!isShopifyConfigured) {
    throw new Error(
      "[shopify] Storefront API credentials are missing or incomplete in environment."
    );
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // In server-side contexts, prefer private access token when provided
  if (SHOPIFY_PRIVATE_ACCESS_TOKEN) {
    headers["Shopify-Storefront-Private-Token"] = SHOPIFY_PRIVATE_ACCESS_TOKEN;
  } else if (SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    headers["X-Shopify-Storefront-Access-Token"] = SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  }

  const fetchOptions: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables: options.variables,
    }),
  };

  if (typeof options.revalidate === "number" || options.tags) {
    fetchOptions.next = {
      revalidate: options.revalidate,
      tags: options.tags,
    };
  } else if (options.cache) {
    fetchOptions.cache = options.cache;
  }

  const response = await fetch(endpoint, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `[shopify] Network error ${response.status} ${response.statusText}: ${errorText}`
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    const errorMessage = json.errors.map((e) => e.message).join(", ");
    throw new Error(`[shopify] GraphQL error: ${errorMessage}`);
  }

  if (!json.data) {
    throw new Error("[shopify] No data returned from Storefront API");
  }

  return json.data;
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string;
}

export interface CartCreateResult {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
}

const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!], $discountCodes: [String!]) {
    cartCreate(input: { lines: $lines, discountCodes: $discountCodes }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Creates a Shopify cart and generates a live checkout URL.
 */
export async function createShopifyCart(
  lines: CartLineInput[],
  discountCodes?: string[]
): Promise<CartCreateResult> {
  const result = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_CREATE_MUTATION, {
    variables: {
      lines,
      discountCodes: discountCodes?.filter(Boolean),
    },
    cache: "no-store",
  });

  if (result.cartCreate.userErrors?.length > 0) {
    const msg = result.cartCreate.userErrors.map((e) => e.message).join(", ");
    throw new Error(`[shopify] Cart creation failed: ${msg}`);
  }

  if (!result.cartCreate.cart) {
    throw new Error("[shopify] Cart could not be initialized");
  }

  return result.cartCreate.cart;
}

