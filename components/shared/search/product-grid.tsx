import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductGrid({ products }: { products: any[] }) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg font-medium text-zinc-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products.map(({ node }: any) => (
          <Link
            key={node.id}
            href={`/product/${node.handle}`}
            className="group block h-full"
          >
            <Card className="h-full border-none shadow-none bg-transparent">
              <CardContent className="p-0 relative aspect-4/5 overflow-hidden bg-zinc-100">
                {node.featuredImage ? (
                  <Image
                    src={node.featuredImage.url}
                    alt={node.featuredImage.altText || node.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-zinc-100 text-zinc-300">
                    No Image
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-1 p-4 px-0">
                <h3 className="text-sm font-bold uppercase text-zinc-900 group-hover:underline underline-offset-4">
                  {node.title}
                </h3>
                <p className="text-sm text-zinc-500 font-medium">
                  {formatPrice(node.priceRange.minVariantPrice.amount)}
                </p>
              </CardFooter>
            </Card>
          </Link>
        ))
      }
    </div>
  );
}
