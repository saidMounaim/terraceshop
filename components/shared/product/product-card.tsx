import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.handle}`} className="group block h-full">
      <Card className="h-full border-none shadow-none bg-transparent rounded-none">
        <CardContent className="p-0 relative aspect-4/5 overflow-hidden bg-zinc-100 border-2 border-transparent group-hover:border-amber-400 transition-all duration-300">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-100 text-zinc-300 font-bold uppercase tracking-widest">
              No Image
            </div>
          )}

          {!product.availableForSale && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-zinc-900 text-white rounded-none font-bold uppercase tracking-widest"
              >
                Sold Out
              </Badge>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 p-4 px-0 pt-5">
          <div className="flex w-full justify-between items-start gap-4">
            <h3 className="text-base font-black uppercase leading-tight text-emerald-950 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {product.title}
            </h3>
            <p className="font-mono text-sm font-bold text-emerald-900 shrink-0">
              {formatPrice(product.priceRange.minVariantPrice.amount)}
            </p>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-amber-500 transition-colors">
            {product.productType || "Terrace Wear"}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
