import Link from "next/link";
import { auth } from "@/auth";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "../../cart/cart-sheet";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { CartTrigger } from "./cart-trigger";

export async function Navbar() {
  const session = await auth();

  const c = await cookies();
  const cartId = c.get("cartId")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  const isLoggedIn = !!session?.user;

  return (
    <>
      <CartSheet cart={cart} isLoggedIn={isLoggedIn} />
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <MobileMenu />

          <div className="mr-8 hidden lg:flex">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">TS</span>
              </div>
              <span className="text-xl font-extrabold uppercase tracking-tighter">
                Terrace Shop
              </span>
            </Link>
          </div>

          <div className="flex-1 lg:hidden flex justify-center">
            <Link
              href="/"
              className="text-lg font-extrabold uppercase tracking-tighter"
            >
              Terrace Shop
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            <Link
              href="/search"
              className="text-sm font-bold uppercase tracking-wide hover:text-zinc-600"
            >
              New Arrivals
            </Link>
            <Link
              href="/search/jackets"
              className="text-sm font-bold uppercase tracking-wide hover:text-zinc-600"
            >
              Outerwear
            </Link>
            <Link
              href="/search/shoes"
              className="text-sm font-bold uppercase tracking-wide hover:text-zinc-600"
            >
              Trainers
            </Link>
            <Link
              href="/search/accessories"
              className="text-sm font-bold uppercase tracking-wide hover:text-zinc-600"
            >
              Accessories
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-2 lg:flex-none">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>

            <UserMenu user={session?.user} />

            <CartTrigger quantity={cart?.totalQuantity || 0} />
          </div>
        </div>
      </header>
    </>
  );
}
