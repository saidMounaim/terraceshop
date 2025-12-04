"use client";

import { useTransition } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateItemQuantity } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";

export function EditItemQuantity({
  item,
  type,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  type: "plus" | "minus";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;

    startTransition(async () => {
      await updateItemQuantity(null, {
        lineId: item.id,
        variantId: item.merchandise.id,
        quantity: newQuantity,
      });
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 rounded-full border-zinc-200"
      onClick={handleUpdate}
      disabled={isPending || (type === "minus" && item.quantity <= 1)}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : type === "plus" ? (
        <Plus className="h-3 w-3" />
      ) : (
        <Minus className="h-3 w-3" />
      )}
    </Button>
  );
}
