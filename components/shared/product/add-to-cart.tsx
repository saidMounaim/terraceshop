"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addItem } from "@/lib/actions/cart";
import { useCartStore } from "@/lib/store/cart";

export function AddToCart({
  variantId,
  availableForSale,
}: {
  variantId?: string;
  availableForSale: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { addItemOptimistic, openCart, setQuantity } = useCartStore();

  const handleAddToCart = () => {
    if (!availableForSale || !variantId) return;

    addItemOptimistic(1);

    startTransition(async () => {
      const result = await addItem(null, variantId);

      if (result?.success) {
        setQuantity(result.cart.totalQuantity);
        router.refresh();
        openCart();
      } else {
        addItemOptimistic(-1);
        toast.error(result?.error || "Failed to add item");
      }
    });
  };

  if (!availableForSale) {
    return (
      <Button
        disabled
        className="w-full h-14 rounded-none bg-zinc-100 text-zinc-400 font-black uppercase tracking-widest cursor-not-allowed"
      >
        Sold Out
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending}
      className={cn(
        "w-full h-14 rounded-none text-base font-black uppercase tracking-widest transition-all duration-200",
        "bg-emerald-950 text-white hover:bg-emerald-900",
        "border-2 border-transparent hover:border-amber-400"
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Adding...
        </>
      ) : (
        <span className="flex items-center gap-2">Add to Cart</span>
      )}
    </Button>
  );
}
