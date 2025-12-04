import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Outerwear",
    slug: "jackets",
    image:
      "https://images.unsplash.com/photo-1544983025-a1c223c5e8c2?q=80&w=1000&auto=format&fit=crop", // Parka
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Trainers",
    slug: "shoes",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop", // Shoes
    className: "lg:col-span-1 lg:row-span-1",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1575444654924-a33758b90c10?q=80&w=1000&auto=format&fit=crop", // Hats
    className: "lg:col-span-1 lg:row-span-1",
  },
];

export function Categories() {
  return (
    <section className="bg-zinc-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-12 text-3xl font-extrabold uppercase tracking-tight text-zinc-950">
          The Uniform
        </h2>

        <div className="grid h-[600px] w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/search/${cat.slug}`}
              className={cn(
                "group relative overflow-hidden rounded-xl bg-zinc-200",
                cat.className
              )}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold uppercase italic tracking-wider text-white">
                  {cat.name}
                </h3>
                <span className="mt-2 inline-block text-xs font-medium text-white/80 underline underline-offset-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
