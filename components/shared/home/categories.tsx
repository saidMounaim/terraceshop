import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCollections } from "@/lib/shopify";

export async function Categories() {
  const collections = await getCollections();

  if (!collections.length) return null;

  return (
    <section className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-emerald-950">
            The Uniform
          </h2>
          <Link
            href="/search"
            className="text-sm font-bold uppercase tracking-wide text-emerald-700 hover:text-emerald-900 underline underline-offset-4"
          >
            View All Collections
          </Link>
        </div>

        <div className="grid h-[600px] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {collections.map(({ node }: any, index: number) => {
            const isBig = index === 0;
            const gridClass = isBig
              ? "lg:col-span-2 lg:row-span-2 bg-emerald-900"
              : "lg:col-span-1 lg:row-span-1 bg-zinc-900";

            return (
              <Link
                key={node.handle}
                href={`/search/${node.handle}`}
                className={cn(
                  "group relative overflow-hidden rounded-none shadow-sm hover:shadow-xl transition-all duration-300",
                  gridClass
                )}
              >
                {node.image ? (
                  <Image
                    src={node.image.url}
                    alt={node.image.altText || node.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    sizes={
                      isBig
                        ? "(min-width: 1024px) 66vw, 100vw"
                        : "(min-width: 1024px) 33vw, 100vw"
                    }
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                    <span className="text-zinc-500 font-bold uppercase">
                      No Image
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "absolute inset-0 opacity-60 transition-opacity group-hover:opacity-40",
                    isBig
                      ? "bg-linear-to-t from-emerald-950 via-emerald-900/20 to-transparent"
                      : "bg-linear-to-t from-black via-black/20 to-transparent"
                  )}
                />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2 translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                    {node.title}
                  </h3>
                  <div className="h-1 w-12 bg-amber-400 mb-4 transition-all duration-300 group-hover:w-24" />
                  <span className="inline-flex items-center text-xs font-bold text-white uppercase tracking-widest opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    Shop Now <span className="ml-2">→</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
