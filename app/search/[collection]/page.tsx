import type { Metadata } from "next";
import { getCollectionProducts } from "@/lib/shopify";
import { getSortOption } from "@/lib/shopify/filter-utils";
import { SortDropdown } from "@/components/shared/search/sort-dropdown";
import { ProductGrid } from "@/components/shared/search/product-grid";

export const dynamic = "force-dynamic";

type Props = {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection } = await params;
  return {
    title: `${
      collection.charAt(0).toUpperCase() + collection.slice(1)
    } | Terrace Shop`,
    description: `Shop the latest ${collection} collection.`,
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { collection } = await params;
  const { sort } = (await searchParams) as { [key: string]: string };

  const { sortKey, reverse } = getSortOption(sort);

  const products = await getCollectionProducts({
    collection: collection,
    sortKey,
    reverse,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      <div className="flex flex-col items-start justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-zinc-900">
            {collection}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {products.length} Products Found
          </p>
        </div>

        <SortDropdown />
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
