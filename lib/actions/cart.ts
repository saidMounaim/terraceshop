"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";

import { revalidateTag } from "next/cache";
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
    const isLoggedIn = !!(token && email);

    // 2. If NO Cart exists, create one
    if (!cartId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = { lines: [] };

      if (isLoggedIn) {
        input.buyerIdentity = {
          customerAccessToken: token,
          email: email,
        };
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { body } = await shopifyFetch<any>({
        query: createCartMutation,
        variables: { input },
        cacheTag: ["cart"],
      });

      cart = body.data.cartCreate.cart;
      cartId = cart.id;
      c.set("cartId", cartId!);
    }

    // 3. If Cart EXISTS and user is logged in, try to sync it
    // (This handles the case where they started as Guest -> Logged In)
    else if (isLoggedIn) {
      await updateCartBuyerIdentity(cartId, token, email);
    }

    // 4. Add the Item
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body } = await shopifyFetch<any>({
      query: addToCartMutation,
      variables: {
        cartId,
        lines: [{ merchandiseId: variantId, quantity: 1 }],
      },
      cacheTag: ["cart"],
    });

    if (body.data.cartLinesAdd?.userErrors?.length > 0) {
      return { error: body.data.cartLinesAdd.userErrors[0].message };
    }

    revalidateTag("cart", "max");
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
    });

    revalidateTag("cart", "max");
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
    });

    revalidateTag("cart", "max");
    return { success: true };
  } catch (e) {
    return { error: "Error updating quantity" };
  }
}

export async function updateCartBuyerIdentity(
  cartId: string,
  customerAccessToken: string,
  email: string
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body } = await shopifyFetch<any>({
      query: updateCartBuyerIdentityMutation,
      variables: {
        cartId,
        buyerIdentity: {
          customerAccessToken,
          email,
        },
      },
      cacheTag: ["cart"],
    });
    return body.data.cartBuyerIdentityUpdate.cart;
  } catch (error) {
    console.error("Failed to sync cart identity:", error);
    return null;
  }
}
