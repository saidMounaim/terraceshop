import { env } from "@/lib/env";
import "server-only";

type AdminFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
};

type RestMethod = "GET" | "POST" | "PUT" | "DELETE";

// Generic GraphQL Fetch Helper
export async function shopifyAdminFetch({
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
    throw body.errors[0];
  }

  return {
    status: response.status,
    body,
  };
}

// Generic REST Fetch Helper
async function shopifyAdminRestFetch<T>(
  path: string,
  method: RestMethod = "GET",
  body?: unknown
): Promise<T> {
  const endpoint = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/${path}`;

  const response = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // We return the raw JSON because REST errors need specific handling (like 'email taken')
  return response.json();
}

// Create Customer via REST API
export async function createCustomerREST(user: {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}) {
  const tempPassword = Math.random().toString(36).slice(-10) + "1A!";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await shopifyAdminRestFetch<any>("customers.json", "POST", {
    customer: {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      verified_email: true,
      send_email_welcome: false,
      password: tempPassword,
      password_confirmation: tempPassword,
      tags: user.tags?.join(",") || "auth_google",
    },
  });

  if (data.errors) {
    const errorString = JSON.stringify(data.errors);
    if (errorString.includes("taken")) {
      return { status: "merged" };
    }
    throw new Error(`Shopify REST Error: ${errorString}`);
  }

  return { status: "created", customer: data.customer };
}

// Save and Retrieve Cart ID in Customer Metafields
export async function saveCartToCustomer(email: string, cartId: string) {
  const customer = await findCustomerByEmail(email);
  if (!customer) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await shopifyAdminRestFetch<any>(
    `customers/${customer.id}.json`,
    "PUT",
    {
      customer: {
        id: customer.id,
        metafields: [
          {
            namespace: "custom",
            key: "active_cart_id",
            value: cartId,
            type: "single_line_text_field",
          },
        ],
      },
    }
  );
}

// Retrieve Cart ID from Customer Metafields
export async function getCartFromCustomer(email: string) {
  const customer = await findCustomerByEmail(email);
  if (!customer) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = await shopifyAdminRestFetch<any>(
    `customers/${customer.id}/metafields.json`,
    "GET"
  );

  const metafield = body.metafields?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (m: any) => m.key === "active_cart_id" && m.namespace === "custom"
  );

  return metafield ? metafield.value : null;
}

// Helper: Find Customer ID by Email
async function findCustomerByEmail(email: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await shopifyAdminRestFetch<any>(
    `customers/search.json?query=email:${email}`,
    "GET"
  );
  return data.customers?.[0] || null;
}
