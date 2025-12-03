import { shopifyAdminFetch } from "@/lib/shopify/admin";

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

// Create a customer in Shopify (if they log in with Google for the first time)
export async function createShopifyCustomer(user: {
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await shopifyAdminFetch<any>({
    query: mutation,
    variables: {
      input: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        verifiedEmail: true,
        sendEmailWelcome: false,
      },
    },
  });

  return data.customerCreate.customer;
}
