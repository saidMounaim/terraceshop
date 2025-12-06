"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortingOptions } from "@/lib/shopify/filter-utils";

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase text-zinc-500 hidden sm:block">
        Sort by:
      </span>
      <Select defaultValue={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] h-10 border-zinc-200 bg-white font-bold uppercase text-xs tracking-wide focus:ring-black">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {sortingOptions.map((option) => (
            <SelectItem
              key={option.slug}
              value={option.slug}
              className="text-xs font-medium uppercase"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
