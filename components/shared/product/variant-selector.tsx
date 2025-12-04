"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VariantSelector({
  options,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return options.map((option) => (
    <div key={option.id} className="mb-8">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-900">
        {option.name}
      </h3>
      <div className="flex flex-wrap gap-3">
        {option.values.map((value: string) => {
          const isActive =
            searchParams.get(option.name.toLowerCase()) === value;

          return (
            <button
              key={value}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set(option.name.toLowerCase(), value);
                router.replace(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
              }}
              className={cn(
                "min-w-16 border px-4 py-3 text-sm font-bold uppercase transition-all",
                isActive
                  ? "border-black bg-black text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-black"
              )}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  ));
}
