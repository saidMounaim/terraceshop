"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCart } from "../../cart/cart-context";

export function CartTrigger({ quantity }: { quantity: number }) {
  const { openCart, updateCartQuantity } = useCart();

  useEffect(() => {
    updateCartQuantity(quantity);
  }, [quantity, updateCartQuantity]);

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
      <ShoppingBag className="h-5 w-5" />
      {quantity > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white animate-in zoom-in">
          {quantity}
        </span>
      )}
      <span className="sr-only">Open cart</span>
    </Button>
  );
}
