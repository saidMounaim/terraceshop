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

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isPending || !availableForSale}
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
      ) : !availableForSale ? (
        "Out of Stock"
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}
