import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-emerald-950 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Terrace Atmosphere"
          fill
          className="object-cover opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-[10s] ease-out"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-900/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-emerald-950/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:pb-32">
        <div className="space-y-6 max-w-4xl">
          <Badge className="w-fit rounded-sm bg-amber-400 text-black px-3 py-1 text-xs font-black uppercase tracking-widest hover:bg-amber-500 border-none">
            Matchday Ready • Est. 2025
          </Badge>

          <h1 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl lg:text-8xl text-white drop-shadow-lg">
            From the stands{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-200 to-white">
              To the streets.
            </span>
          </h1>

          <p className="max-w-lg text-lg font-medium text-emerald-100/90 drop-shadow-md">
            Premium casual wear for the modern supporter. Discover the latest
            drop of technical outerwear and terrace essentials.
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-none bg-white text-emerald-950 px-8 text-base font-bold uppercase tracking-wide hover:bg-zinc-200 border-2 border-transparent"
            >
              <Link href="/search">Shop New Arrivals</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 rounded-none border-2 border-white bg-transparent px-8 text-base font-bold uppercase tracking-wide text-white hover:bg-white hover:text-emerald-950"
            >
              <Link href="/search/jackets">View Outerwear</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
