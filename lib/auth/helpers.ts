import { createCustomerREST, shopifyAdminFetch } from "@/lib/shopify/admin";

// Check if a customer exists by email (Server-Side / Admin API)
export async function getShopifyCustomer(email: string) {
  const query = `
    query getCustomer($email: String!) {
      customers(first: 1, query: $email) {
        edges {
          node {
            id
            email
            firstName
            lastName
          }
        }
      }
    }
  `;

  const data = await shopifyAdminFetch<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customers: { edges: { node: any }[] };
  }>({
    query,
    variables: { email: `email:${email}` },
  });

  return data.customers.edges[0]?.node || null;
}

// Create or sync a Shopify customer (Server-Side / Admin API)
export async function syncShopifyCustomer(user: {
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  try {
    const result = await createCustomerREST({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      tags: ["auth_google", "headless_user"],
    });

    return result;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Sync Error:", error);
    throw error;
  }
}
