import { env } from "@/lib/env";
import "server-only";

type AdminFetchParams = {
  query: string;
  variables?: Record<string, unknown>;
};

// The Admin API Engine
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

// Create a customer in Shopify (if they log in with Google for the first time)
export async function createCustomerREST(user: {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}) {
  const endpoint = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers.json`;

  const tempPassword = Math.random().toString(36).slice(-10) + "1A!";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({
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
    }),
    cache: "no-store",
  });

  const data = await response.json();

  if (data.errors) {
    const errorString = JSON.stringify(data.errors);
    if (errorString.includes("taken")) {
      return { status: "merged" };
    }
    throw new Error(`Shopify REST Error: ${errorString}`);
  }

  return { status: "created", customer: data.customer };
}

// Save Cart ID to Customer Metafield
export async function saveCartToCustomer(email: string, cartId: string) {
  const customer = await findCustomerByEmail(email);
  if (!customer) return;

  const response = await fetch(
    `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers/${customer.id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN,
      },
      body: JSON.stringify({
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
      }),
    }
  );

  return response.json();
}

// Get Cart ID from Customer Metafield
export async function getCartFromCustomer(email: string) {
  const customer = await findCustomerByEmail(email);
  if (!customer) return null;

  const response = await fetch(
    `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers/${customer.id}/metafields.json`,
    {
      headers: { "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN },
    }
  );

  const body = await response.json();
  const metafield = body.metafields.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (m: any) => m.key === "active_cart_id" && m.namespace === "custom"
  );

  return metafield ? metafield.value : null;
}

// Helper: Find Customer ID by Email
async function findCustomerByEmail(email: string) {
  const res = await fetch(
    `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/customers/search.json?query=email:${email}`,
    {
      headers: { "X-Shopify-Access-Token": env.SHOPIFY_ADMIN_ACCESS_TOKEN },
    }
  );
  const data = await res.json();
  return data.customers[0] || null;
}
