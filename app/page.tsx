import { Categories } from "@/components/shared/home/categories";
import { FeaturedProducts } from "@/components/shared/home/featured-products";
import { Hero } from "@/components/shared/home/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <Hero />

      <div className="w-full overflow-hidden border-y border-zinc-800 bg-zinc-950 py-3">
        <div className="flex w-full animate-marquee whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="mx-8 flex items-center gap-4">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                No Pyro No Party
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            </div>
          ))}
        </div>
      </div>

      <FeaturedProducts />

      <Categories />

      <section className="border-t border-zinc-100 bg-white py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-extrabold uppercase tracking-tight text-zinc-900">
            Join the Firm
          </h2>
          <p className="mt-4 text-zinc-500">
            Sign up for early access to drops, exclusive away day guides, and
            member-only sales.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-zinc-50"
            />
            <Button
              size="lg"
              className="h-12 px-8 uppercase font-bold tracking-wide bg-zinc-950 hover:bg-zinc-800"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
