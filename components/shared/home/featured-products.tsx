import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { dummyProducts } from "@/lib/placeholder-data";

export async function FeaturedProducts() {
  const products = dummyProducts;
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Away Days
            </h2>
            <p className="text-zinc-500">
              Essential kit for the traveling supporter.
            </p>
          </div>
          <Button
            variant="link"
            asChild
            className="hidden text-zinc-900 underline-offset-4 sm:flex"
          >
            <Link href="/search">View all products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            products.map(({ node }: any) => (
              <Link
                key={node.id}
                href={`/product/${node.handle}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border-none shadow-none rounded-none">
                  <CardContent className="p-0 relative aspect-4/5 overflow-hidden bg-zinc-100">
                    <Image
                      src={node.featuredImage?.url}
                      alt={node.featuredImage?.altText || node.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <Button
                        size="icon"
                        className="rounded-full h-10 w-10 shadow-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-1 p-4">
                    <h3 className="text-sm font-medium text-zinc-900 group-hover:underline">
                      {node.title}
                    </h3>
                    <p className="text-sm font-semibold text-zinc-500">
                      {formatPrice(node.priceRange.minVariantPrice.amount)}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))
          }
        </div>
      </div>
    </section>
  );
}
