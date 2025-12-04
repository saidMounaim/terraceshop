import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Terrace Atmosphere"
          fill
          className="object-cover opacity-50 grayscale hover:scale-100 transition-transform duration-[2s]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 sm:pb-32">
        <div className="space-y-6">
          <Badge
            variant="secondary"
            className="w-fit rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black bg-white/90 backdrop-blur"
          >
            Est. 2025 • Matchday Ready
          </Badge>

          <h1 className="max-w-4xl text-5xl font-extrabold uppercase leading-[0.9] tracking-tighter sm:text-7xl lg:text-8xl">
            From the stands <br />
            <span className="text-zinc-400">To the streets.</span>
          </h1>

          <p className="max-w-lg text-lg font-light text-zinc-300">
            Premium casual wear for the modern supporter. Discover the latest
            drop of technical outerwear and terrace essentials.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full px-8 text-base font-bold uppercase tracking-wide"
            >
              <Link href="/search">Shop New Arrivals</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-base font-bold uppercase tracking-wide text-white backdrop-blur-sm hover:bg-white hover:text-black hover:border-white"
            >
              <Link href="/search/jackets">View Outerwear</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
