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
        <h2 className="mb-12 text-3xl font-extrabold uppercase tracking-tight text-zinc-950">
          The Uniform
        </h2>

        <div className="grid h-[600px] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            collections.map(({ node }: any, index: number) => {
              const isBig = index === 0;
              const gridClass = isBig
                ? "lg:col-span-2 lg:row-span-2"
                : "lg:col-span-1 lg:row-span-1";

              return (
                <Link
                  key={node.handle}
                  href={`/search/${node.handle}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl bg-zinc-200",
                    gridClass
                  )}
                >
                  {node.image ? (
                    <Image
                      src={node.image.url}
                      alt={node.image.altText || node.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={
                        isBig
                          ? "(min-width: 1024px) 66vw, 100vw"
                          : "(min-width: 1024px) 33vw, 100vw"
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-300">
                      <span className="text-zinc-500 font-bold uppercase">
                        No Image
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold uppercase italic tracking-wider text-white">
                      {node.title}
                    </h3>
                    <span className="mt-2 inline-block text-xs font-medium text-white/80 underline underline-offset-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      Shop Now
                    </span>
                  </div>
                </Link>
              );
            })
          }
        </div>
      </div>
    </section>
  );
}
