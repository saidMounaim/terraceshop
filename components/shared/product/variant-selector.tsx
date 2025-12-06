"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function VariantSelector({ options }: { options: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return options.map((option) => (
    <div key={option.id} className="mb-8 last:mb-0">
      <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-zinc-400">
        Select {option.name}
      </h3>
      <div className="flex flex-wrap gap-2">
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
                "min-w-16 h-12 px-6 text-sm font-bold uppercase tracking-wide transition-all duration-200 border-2",
                isActive
                  ? "bg-amber-400 border-amber-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                  : "bg-transparent border-zinc-200 text-zinc-600 hover:border-emerald-950 hover:text-emerald-950"
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
