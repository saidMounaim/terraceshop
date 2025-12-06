"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { EditItemQuantity } from "./edit-item-quantity";
import { DeleteItem } from "./delete-item";
import { useTransition } from "react";
import { proceedToCheckout } from "@/lib/actions/chekout";
import { useCartStore } from "@/lib/store/cart";

export function CartSheet({
  cart,
  isLoggedIn,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: any;
  isLoggedIn: boolean;
}) {
  const { isOpen, closeCart } = useCartStore();
  const router = useRouter();
  const items = cart?.lines?.edges || [];

  const [isPending, startTransition] = useTransition();

  const handleCheckout = () => {
    closeCart();

    if (!isLoggedIn) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    startTransition(async () => {
      await proceedToCheckout();
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white">
        <SheetHeader className="px-6 py-4 border-b border-zinc-100 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-extrabold uppercase tracking-tight">
            Your Cart ({cart?.totalQuantity || 0})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold uppercase text-zinc-900">
                  Your bag is empty
                </p>
                <p className="text-sm text-zinc-500">
                  {"Looks like you haven't added any kit yet."}
                </p>
              </div>
              <Button
                asChild
                className="mt-4 bg-black text-white font-bold uppercase"
                onClick={closeCart}
              >
                <Link href="/search">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.map(({ node }: any) => (
                  <div key={node.id} className="flex gap-4">
                    <div className="relative h-24 w-20 flex-none overflow-hidden rounded-md bg-zinc-100 border border-zinc-200">
                      {node.merchandise.product.featuredImage && (
                        <Image
                          src={node.merchandise.product.featuredImage.url}
                          alt={node.merchandise.product.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Link
                            href={`/product/${node.merchandise.product.handle}`}
                            className="text-sm font-bold uppercase leading-tight hover:underline line-clamp-1"
                            onClick={closeCart}
                          >
                            {node.merchandise.product.title}
                          </Link>
                          <p className="text-xs text-zinc-500 uppercase">
                            {node.merchandise.title}
                          </p>
                        </div>
                        <DeleteItem item={node} />
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-bold">
                          {formatPrice(node.cost.totalAmount.amount)}
                        </p>

                        <div className="flex items-center gap-3">
                          <EditItemQuantity item={node} type="minus" />
                          <span className="w-4 text-center text-sm font-medium">
                            {node.quantity}
                          </span>
                          <EditItemQuantity item={node} type="plus" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-6">
            <div className="mb-4 flex items-center justify-between text-base font-bold uppercase">
              <span>Subtotal</span>
              <span>
                {formatPrice(cart?.cost?.subtotalAmount?.amount || 0)}
              </span>
            </div>
            <p className="mb-4 text-xs text-zinc-500">
              Shipping & taxes calculated at checkout.
            </p>
            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full h-12 bg-black text-white font-bold uppercase hover:bg-zinc-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : isLoggedIn ? (
                "Checkout"
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Log in to Checkout
                </span>
              )}
            </Button>

            {!isLoggedIn && (
              <p className="mt-3 text-xs text-center text-zinc-500">
                You must have an account to place an order.
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
