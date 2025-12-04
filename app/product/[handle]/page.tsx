import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        <div className="product-gallery">
          <ProductGallery
            images={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              product.images.edges.map((e: any) => e.node)
            }
          />
        </div>

        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:sticky lg:top-24 h-fit">
          <div className="mb-8 border-b border-zinc-200 pb-8">
            <h1 className="text-3xl font-extrabold uppercase tracking-tighter text-black sm:text-5xl">
              {product.title}
            </h1>
            <div className="mt-4 flex items-end gap-4">
              <p className="text-2xl font-bold text-zinc-900">
                {formatPrice(currentVariant.price.amount)}
              </p>
            </div>
          </div>

          <VariantSelector options={product.options} />

          <div className="mt-8 flex flex-col gap-4">
            <AddToCart
              variantId={currentVariant?.id}
              availableForSale={currentVariant?.availableForSale}
            />
            <p className="text-center text-xs text-zinc-500 uppercase tracking-wide">
              Free Shipping on orders over $150
            </p>
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-10">
            <h3 className="text-sm font-bold uppercase text-zinc-900 mb-4">
              Description
            </h3>
            <div
              className="prose prose-sm text-zinc-600 prose-headings:font-bold prose-headings:uppercase"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
