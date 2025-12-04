"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { addItem } from "@/lib/actions/cart";
import { useCart } from "../cart/cart-context";
import { useRouter } from "next/navigation";

export function AddToCart({
  variantId,
  availableForSale,
}: {
  variantId?: string;
  availableForSale: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { openCart, updateCartQuantity } = useCart();

  const handleAddToCart = () => {
    if (!availableForSale || !variantId) return;

    startTransition(async () => {
      const result = await addItem(null, variantId);

      if (result?.success) {
        updateCartQuantity(result.cart.totalQuantity);
        router.refresh();

        openCart();
      } else {
        console.error(result?.error);
      }
    });
  };

  if (!availableForSale) {
    return (
      <Button
        disabled
        className="w-full bg-zinc-200 text-zinc-500 cursor-not-allowed uppercase font-bold"
      >
        Out of Stock
      </Button>
    );
  }

  if (!variantId) {
    return (
      <Button
        disabled
        className="w-full bg-zinc-200 text-zinc-500 cursor-not-allowed uppercase font-bold"
      >
        Select Size
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      className={cn(
        "w-full h-14 uppercase font-bold tracking-widest text-lg rounded-none",
        isPending ? "bg-zinc-800" : "bg-black hover:bg-zinc-900"
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Adding...
        </>
      ) : (
        <>Add to Cart</>
      )}
    </Button>
  );
}
