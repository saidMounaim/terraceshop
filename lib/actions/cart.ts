"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
  updateCartBuyerIdentityMutation,
} from "../shopify/mutations/cart";
import { auth } from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addItem(prevState: any, variantId: string | undefined) {
  const c = await cookies();
  let cartId = c.get("cartId")?.value;
  let cart;

  if (!variantId) {
    return { error: "Missing product variant" };
  }

  try {
    const session = await auth();
    const token = session?.accessToken as string | undefined;
    const email = session?.user?.email;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buyerIdentity: any = {};
    if (email) buyerIdentity.email = email;
    if (token) buyerIdentity.customerAccessToken = token;

    if (email || token) {
      buyerIdentity.countryCode = "MA";
    }

    if (!cartId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = { lines: [] };

      if (Object.keys(buyerIdentity).length > 0) {
        input.buyerIdentity = buyerIdentity;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { body } = await shopifyFetch<any>({
        query: createCartMutation,
        variables: { input },
        cacheTag: ["cart"],
        cache: "no-store",
      });

      cart = body.data.cartCreate.cart;
      cartId = cart.id;
      c.set("cartId", cartId!);
    } else if (Object.keys(buyerIdentity).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await shopifyFetch<any>({
        query: updateCartBuyerIdentityMutation,
        variables: {
          cartId,
          buyerIdentity,
        },
        cacheTag: ["cart"],
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body } = await shopifyFetch<any>({
      query: addToCartMutation,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      },
      cacheTag: ["cart"],
      cache: "no-store",
    });

    if (body.data.cartLinesAdd?.userErrors?.length > 0) {
      return { error: body.data.cartLinesAdd.userErrors[0].message };
    }

    return { success: true, cart: body.data.cartLinesAdd.cart };
  } catch (e) {
    console.error(e);
    return { error: "Error adding to cart" };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function removeItem(prevState: any, lineId: string) {
  const c = await cookies();
  const cartId = c.get("cartId")?.value;

  if (!cartId) {
    return { error: "Missing cart ID" };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await shopifyFetch<any>({
      query: removeFromCartMutation,
      variables: {
        cartId,
        lineIds: [lineId],
      },
      cacheTag: ["cart"],
      cache: "no-store",
    });

    return { success: true };
  } catch (e) {
    return { error: "Error removing item" };
  }
}

export async function updateItemQuantity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  payload: { lineId: string; variantId: string; quantity: number }
) {
  const c = await cookies();
  const cartId = c.get("cartId")?.value;

  if (!cartId) {
    return { error: "Missing cart ID" };
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      return await removeItem(null, lineId);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await shopifyFetch<any>({
      query: editCartItemsMutation,
      variables: {
        cartId,
        lines: [
          {
            id: lineId,
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
      cacheTag: ["cart"],
      cache: "no-store",
    });

    return { success: true };
  } catch (e) {
    return { error: "Error updating quantity" };
  }
}

export async function updateCartBuyerIdentity(
  cartId: string,
  user: { email: string; token?: string }
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const identity: any = {
      email: user.email,
      countryCode: "MA",
    };

    if (user.token) {
      identity.customerAccessToken = user.token;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body } = await shopifyFetch<any>({
      query: updateCartBuyerIdentityMutation,
      variables: {
        cartId,
        buyerIdentity: identity,
      },
      cacheTag: ["cart"],
      cache: "no-store",
    });

    return body.data.cartBuyerIdentityUpdate.cart;
  } catch (error) {
    console.error("Failed to sync cart identity:", error);
    return null;
  }
}
