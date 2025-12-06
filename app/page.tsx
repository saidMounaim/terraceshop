import { Categories } from "@/components/shared/home/categories";
import { FeaturedProducts } from "@/components/shared/home/featured-products";
import { Hero } from "@/components/shared/home/hero";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans antialiased">
      <Hero />
      <FeaturedProducts />
      <Categories />
    </main>
  );
}
