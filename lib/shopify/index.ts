import { env } from "@/lib/env";

type ShopifyFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
  cacheTag?: string[];
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
}: ShopifyFetchParams): Promise<ShopifyResponse<T>> {
  try {
    const result = await fetch(
      `https://${env.SHOPIFY_STORE_DOMAIN}/api/2024-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
        next: { tags: ["shopify", ...cacheTag] },
      }
    );

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    console.error("Shopify Storefront API Error:", e);
    throw {
      error: e,
      query,
    };
  }
}
