import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/shared/product/gallery";
import { VariantSelector } from "@/components/shared/product/variant-selector";
import { AddToCart } from "@/components/shared/product/add-to-cart";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.featuredImage?.url],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { handle } = await params;
  const sp = await searchParams;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const currentVariant =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product.variants.edges.find((variant: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return variant.node.selectedOptions.every((option: any) => {
        return sp[option.name.toLowerCase()] === option.value;
      });
    })?.node || product.variants.edges[0].node;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:py-24">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16">
        {/* Gallery */}
        <div className="product-gallery">
          <ProductGallery
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            images={product.images.edges.map((e: any) => e.node)}
          />
        </div>

        {/* Details - Sticky Sidebar */}
        <div className="mt-10 px-0 lg:mt-0 lg:sticky lg:top-24 h-fit">
          <div className="mb-8 border-b-2 border-emerald-950 pb-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter text-emerald-950 italic sm:text-5xl lg:text-6xl leading-[0.9]">
              {product.title}
            </h1>
            <div className="mt-6 flex items-baseline gap-4">
              <p className="text-3xl font-bold font-mono text-emerald-900">
                {formatPrice(currentVariant.price.amount)}
              </p>
              {/* Optional: Add compare-at-price if on sale */}
            </div>
          </div>

          <VariantSelector options={product.options} />

          <div className="mt-10 flex flex-col gap-4">
            <AddToCart
              variantId={currentVariant?.id}
              availableForSale={currentVariant?.availableForSale}
            />

            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Free Shipping on orders over $150
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-zinc-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-950 mb-6 flex items-center gap-2">
              <span className="h-1 w-8 bg-amber-400" />
              Product Details
            </h3>
            <div
              className="prose prose-sm prose-zinc prose-p:font-medium prose-headings:font-bold prose-headings:uppercase prose-a:text-emerald-700"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
