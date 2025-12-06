"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShoppingBag, ArrowRight } from "lucide-react";
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
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-white border-l-2 border-emerald-950">
        {/* Header - Industrial Style */}
        <SheetHeader className="px-6 py-6 border-b-2 border-emerald-950/10 bg-zinc-50 flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-xl font-black uppercase tracking-tighter text-emerald-950 italic flex items-center gap-2">
            Matchday Bag{" "}
            <span className="text-zinc-400 not-italic font-mono text-sm">
              ({cart?.totalQuantity || 0})
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-6 text-center">
              <div className="h-20 w-20 bg-zinc-100 flex items-center justify-center border-2 border-zinc-200">
                <ShoppingBag className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black uppercase italic text-emerald-950">
                  Bag Empty
                </p>
                <p className="text-sm font-medium text-zinc-500 max-w-[200px] mx-auto">
                  Your rotation needs an update. Check the latest drop.
                </p>
              </div>
              <Button
                asChild
                className="h-12 px-8 bg-emerald-950 text-white font-bold uppercase tracking-widest hover:bg-emerald-900 rounded-none"
                onClick={closeCart}
              >
                <Link href="/search">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.map(({ node }: any) => (
                  <div key={node.id} className="flex gap-5 group">
                    {/* Image - Sharp & Bordered */}
                    <div className="relative h-28 w-24 flex-none overflow-hidden bg-zinc-100 border-2 border-transparent group-hover:border-amber-400 transition-colors duration-300">
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
                            className="text-base font-black uppercase leading-tight text-emerald-950 hover:text-emerald-700 hover:underline decoration-2 underline-offset-2 line-clamp-2"
                            onClick={closeCart}
                          >
                            {node.merchandise.product.title}
                          </Link>
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                            {node.merchandise.title}
                          </p>
                        </div>
                        <DeleteItem item={node} />
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <p className="font-mono text-sm font-bold text-emerald-900">
                          {formatPrice(node.cost.totalAmount.amount)}
                        </p>

                        <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-1 py-1">
                          <EditItemQuantity item={node} type="minus" />
                          <span className="w-6 text-center text-xs font-bold font-mono">
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
          <div className="border-t-2 border-emerald-950 bg-zinc-50 px-6 py-8">
            <div className="mb-6 flex items-center justify-between text-base font-black uppercase tracking-tight text-emerald-950">
              <span>Subtotal</span>
              <span className="font-mono text-lg">
                {formatPrice(cart?.cost?.subtotalAmount?.amount || 0)}
              </span>
            </div>

            <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400 text-center">
              Shipping & taxes calculated at checkout
            </p>

            <Button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full h-14 rounded-none text-base font-black uppercase tracking-widest bg-emerald-950 text-white hover:bg-emerald-900 border-2 border-transparent hover:border-amber-400 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting...
                </>
              ) : isLoggedIn ? (
                <span className="flex items-center gap-2">
                  Checkout <ArrowRight className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Log in to Checkout
                </span>
              )}
            </Button>

            {!isLoggedIn && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 py-2 border border-amber-200">
                <span>⚠️ Account required for secure checkout</span>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
