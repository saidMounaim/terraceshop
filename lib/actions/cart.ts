"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import {
  editCartItemsMutation,
  removeFromCartMutation,
  updateCartBuyerIdentityMutation,
} from "../shopify/mutations/cart";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { addLinesToCart, createShopifyCart } from "../shopify/cart-service";

export type CartActionResult = {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart?: any;
  error?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addItem(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  variantId: string | undefined
): Promise<CartActionResult> {
  if (!variantId) return { success: false, error: "Missing product variant" };

  const c = await cookies();
  const cartId = c.get("cartId")?.value;

  try {
    const session = await auth();
    const identity = session?.user?.email
      ? {
          email: session.user.email,
          token: session.accessToken as string | undefined,
          countryCode: "MA",
        }
      : undefined;

    const lines = [{ merchandiseId: variantId, quantity: 1 }];

    let cart;

    if (!cartId) {
      cart = await createShopifyCart(identity, lines);
      c.set("cartId", cart.id);
    } else {
      try {
        cart = await addLinesToCart(cartId, lines);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (
          error.message === "CART_NOT_FOUND" ||
          error.message.includes("does not exist")
        ) {
          console.warn("♻️ Cart expired. Creating fresh cart...");
          cart = await createShopifyCart(identity, lines);
          c.set("cartId", cart.id);
        } else {
          return { success: false, error: error.message };
        }
      }
    }

    revalidateTag("cart", "max");
    return { success: true, cart };
  } catch (e) {
    console.error("AddItem Critical Error:", e);
    return { success: false, error: "System error. Please try again." };
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
