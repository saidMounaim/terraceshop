import "server-only";

import { env } from "@/lib/env";

type AdminFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
};

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: AdminFetchParams) {
  const endpoint = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const body = await response.json();

  if (body.errors) {
    throw new Error(`Admin API Error: ${JSON.stringify(body.errors)}`);
  }

  return body.data as T;
}
