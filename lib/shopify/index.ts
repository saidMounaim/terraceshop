import { env } from "@/lib/env";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import { getCollectionProductsQuery } from "./queries/collection";
import { getCartQuery } from "./queries/cart";
import { getCustomerOrdersQuery } from "./queries/customer";

export * from "./fragments";
export * from "./queries/product";
export * from "./queries/collection";
export * from "./mutations/customer";

type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
  cacheTag?: string[];
  cache?: RequestCache;
  revalidate?: number | false;
};

type ShopifyError = {
  message: string;
  locations: { line: number; column: number }[];
};

type ShopifyResponse<T> = {
  status: number;
  body: {
    data: T;
    errors?: ShopifyError[];
  };
};

// The Storefront API Engine (Public Access)
export async function shopifyFetch<T>({
  query,
  variables,
  cacheTag = [],
  cache = "force-cache",
  revalidate,
}: ShopifyFetchParams): Promise<ShopifyResponse<T>> {
  try {
    const headers = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    };

    const url = `https://${env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`;

    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { tags: ["shopify", ...cacheTag] },
    };

    if (cache === "no-store") {
      fetchOptions.cache = "no-store";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (fetchOptions.next as any).revalidate;
    } else if (typeof revalidate === "number") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (fetchOptions.next as any).revalidate = revalidate;
    } else {
      fetchOptions.cache = "force-cache";
    }

    const result = await fetch(url, fetchOptions);
    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return { status: result.status, body };
  } catch (e) {
    console.error("Shopify API Error:", e);
    throw { error: e, query };
  }
}

// Get products for a specific collection by its handle
export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: "CREATED" | "PRICE" | "BEST_SELLING" | "TITLE";
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED" ? "CREATED" : sortKey,
    },
    cache: "no-store",
    cacheTag: [`collection-${collection}`],
  });

  return res.body.data.collection?.products?.edges || [];
}

// Get "Featured" products for Homepage
export async function getFeaturedProducts() {
  const products = await getCollectionProducts({
    collection: "frontpage",
  });

  if (products.length > 0) {
    return products;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getProductsQuery,
    variables: {
      sortKey: "CREATED_AT",
      reverse: true,
      first: 4,
    },
    cache: "no-store",
    cacheTag: ["products-featured"],
  });

  return res.body.data.products?.edges || [];
}

// Fetch Single Product by Handle
export async function getProduct(handle: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getProductQuery,
    variables: { handle },
    cacheTag: [`product-${handle}`],
  });

  return res.body.data.product;
}

// Fetch Related Products
export async function getProductRecommendations(productId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getProductRecommendationsQuery,
    variables: { productId },
    cacheTag: [`product-${productId}-recommendations`],
    cache: "no-store",
  });

  return res.body.data.productRecommendations || [];
}

export async function getCart(cartId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getCartQuery,
    variables: { cartId },
    cacheTag: ["cart"],
    cache: "no-store",
  });

  return res.body.data.cart || undefined;
}

// Fetch Customer Orders
export async function getCustomerOrders(accessToken: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getCustomerOrdersQuery,
    variables: { customerAccessToken: accessToken },
    cacheTag: ["customer-orders"],
    cache: "no-store",
  });

  return res.body.data.customer?.orders?.edges || [];
}
