"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCart } from "@/lib/shopify";
import { updateCartBuyerIdentity } from "./cart";

export async function proceedToCheckout() {
  const cartId = (await cookies()).get("cartId")?.value;
  const session = await auth();

  if (!cartId) {
    return redirect("/");
  }

  if (session?.user?.email) {
    await updateCartBuyerIdentity(cartId, {
      email: session.user.email,
      token: session.accessToken,
    });
  } else {
    return redirect("/login?callbackUrl=/checkout");
  }

  const cart = await getCart(cartId);
  const checkoutUrl = cart?.checkoutUrl;

  if (checkoutUrl) {
    redirect(checkoutUrl);
  } else {
    redirect("/");
  }
}
