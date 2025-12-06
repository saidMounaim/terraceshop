import { shopifyFetch } from "@/lib/shopify";
import {
  createCartMutation,
  addToCartMutation,
} from "@/lib/shopify/mutations/cart";

// Create a new cart with optional buyer identity and initial lines
export async function createShopifyCart(
  identity?: { email: string; token?: string; countryCode?: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lines: any[] = []
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input: any = { lines };

  if (identity?.email) {
    input.buyerIdentity = {
      email: identity.email,
      countryCode: identity.countryCode || "MA",
      ...(identity.token && { customerAccessToken: identity.token }),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { body } = await shopifyFetch<any>({
    query: createCartMutation,
    variables: { input },
    cacheTag: ["cart"],
    cache: "no-store",
  });

  return body.data.cartCreate.cart;
}

// Add lines to an existing cart
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addLinesToCart(cartId: string, lines: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { body } = await shopifyFetch<any>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cacheTag: ["cart"],
    cache: "no-store",
  });

  if (body.errors || !body.data.cartLinesAdd) {
    throw new Error("CART_NOT_FOUND");
  }

  if (body.data.cartLinesAdd?.userErrors?.length > 0) {
    throw new Error(body.data.cartLinesAdd.userErrors[0].message);
  }

  return body.data.cartLinesAdd.cart;
}
