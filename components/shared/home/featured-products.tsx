import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/shopify";
import { Plus } from "lucide-react";
import { ProductCard } from "../product/product-card";

export const dynamic = "force-dynamic";

export async function FeaturedProducts() {
  let products = [];
  try {
    products = await getFeaturedProducts();
  } catch (error) {
    console.log(error);
    products = [];
  }

  if (!products.length) return null;

  return (
    <section className="bg-white py-24 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex items-end justify-between">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-emerald-950 italic">
              Away Days
            </h2>
            <p className="font-medium text-emerald-800/60 max-w-md">
              Essential kit for the traveling supporter. Technical fabrics and
              classic silhouettes.
            </p>
          </div>
          <Button
            variant="link"
            asChild
            className="hidden text-emerald-700 font-bold uppercase tracking-wide hover:text-emerald-950 underline-offset-4 sm:flex"
          >
            <Link href="/search">View all kit</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            products.map(({ node }: any) => (
              <ProductCard product={node} key={node.id} />
            ))
          }
        </div>
      </div>
    </section>
  );
}
