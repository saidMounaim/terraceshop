import { env } from "@/lib/env";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries/product";
import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getCartQuery } from "./queries/cart";
import { getCustomerOrdersQuery } from "./queries/customer";
import { getOrdersByEmailQuery } from "./queries/admin";
import { shopifyAdminFetch } from "./admin";

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
  sortKey?: string;
}) {
  const querySortKey = sortKey === "CREATED_AT" ? "CREATED" : sortKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: querySortKey,
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

// Fetch All Products
export async function getAllProducts({
  sortKey,
  reverse,
}: {
  sortKey?: string;
  reverse?: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getProductsQuery,
    variables: {
      sortKey,
      reverse,
      first: 100,
    },
    cacheTag: ["products"],
    cache: "no-store",
  });
  return res.body.data.products?.edges || [];
}

// Fetch All Collections
export async function getCollections() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await shopifyFetch<any>({
    query: getCollectionsQuery,
    cacheTag: ["collections"],
    cache: "no-store",
  });

  const collections = res.body.data.collections?.edges || [];

  const validCollections = collections
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((edge: any) => edge.node.image)
    .slice(0, 3);

  return validCollections;

  return validCollections;
}

export async function getCustomerOrdersByEmail(email: string) {
  const res = await shopifyAdminFetch({
    query: getOrdersByEmailQuery,
    variables: { query: `email:${email}` },
  });

  const orders = res?.body?.data?.orders?.edges || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return orders.map((edge: any) => {
    const fulfillment = edge.node.fulfillments?.[0];
    const tracking = fulfillment?.trackingInfo?.[0];

    return {
      node: {
        id: edge.node.id,
        orderNumber: edge.node.name.replace("#", ""),
        processedAt: edge.node.processedAt,
        financialStatus: edge.node.displayFinancialStatus,
        fulfillmentStatus: edge.node.displayFulfillmentStatus,
        statusUrl: tracking?.url || null,
        totalPrice: {
          amount: edge.node.totalPriceSet.shopMoney.amount,
          currencyCode: edge.node.totalPriceSet.shopMoney.currencyCode,
        },
        lineItems: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          edges: edge.node.lineItems.edges.map((item: any) => ({
            node: {
              title: item.node.title,
              quantity: item.node.quantity,
              variant: {
                image: item.node.image || item.node.variant?.image || null,
              },
            },
          })),
        },
        successfulFulfillments: fulfillment
          ? [
              {
                trackingCompany: tracking?.company,
                trackingInfo: [tracking],
              },
            ]
          : [],
      },
    };
  });
}
