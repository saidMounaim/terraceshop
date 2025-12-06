import { ProductCard } from "@/components/shared/product/product-card";
import { ShoppingBag } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-zinc-200 bg-zinc-50/50">
        <div className="h-16 w-16 bg-zinc-100 flex items-center justify-center mb-4 rounded-none">
          <ShoppingBag className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-xl font-black uppercase italic text-emerald-950">
          No Products Found
        </h3>
        <p className="text-sm font-medium text-zinc-500 max-w-xs mt-2">
          Try adjusting your filters or search for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products.map(({ node }: any) => (
          <ProductCard key={node.id} product={node} />
        ))
      }
    </div>
  );
}
