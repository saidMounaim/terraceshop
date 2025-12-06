export type SortOption = {
  label: string;
  slug: string;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const sortingOptions: SortOption[] = [
  {
    label: "Latest Arrivals",
    slug: "latest",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    label: "Price: Low to High",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    label: "Price: High to Low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
  {
    label: "Best Selling",
    slug: "best-selling",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
];

export function getSortOption(slug?: string) {
  return sortingOptions.find((opt) => opt.slug === slug) || sortingOptions[0];
}
