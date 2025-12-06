"use client";

import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductGallery({ images }: { images: any[] }) {
  if (!images?.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image - Sharp corners */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-zinc-100 border-2 border-transparent hover:border-emerald-950/10 transition-colors">
        <Image
          src={images[0].url}
          alt={images[0].altText || "Product Image"}
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {images.slice(1).map((image: any, i: number) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden bg-zinc-100"
            >
              <Image
                src={image.url}
                alt={image.altText || "Product Detail"}
                fill
                className="object-cover hover:scale-110 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
