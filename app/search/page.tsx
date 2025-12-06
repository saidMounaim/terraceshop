import { ProductGrid } from "@/components/shared/search/product-grid";
import { SortDropdown } from "@/components/shared/search/sort-dropdown";
import { getAllProducts } from "@/lib/shopify";
import { getSortOption } from "@/lib/shopify/filter-utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products | Terrace Shop",
  description: "Browse our complete catalog.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = (await searchParams) as { [key: string]: string };
  const { sortKey, reverse } = getSortOption(sort);

  const products = await getAllProducts({ sortKey, reverse });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-zinc-900">
            All Products
          </h1>
          <p className="mt-2 text-sm text-zinc-500">{products.length} Items</p>
        </div>
        <SortDropdown />
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
