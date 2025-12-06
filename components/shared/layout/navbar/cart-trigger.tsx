"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";

export function CartTrigger({ quantity }: { quantity: number }) {
  const { openCart, cartQuantity, setQuantity } = useCartStore();

  useEffect(() => {
    setQuantity(quantity);
  }, [quantity, setQuantity]);

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
      <ShoppingBag className="h-5 w-5" />

      {cartQuantity > 0 && (
        <span
          className={cn(
            "absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white",
            "animate-in zoom-in duration-300"
          )}
        >
          {cartQuantity}
        </span>
      )}
      <span className="sr-only">Open cart</span>
    </Button>
  );
}
