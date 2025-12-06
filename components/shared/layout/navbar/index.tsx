import Link from "next/link";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { getCart } from "@/lib/shopify";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { CartTrigger } from "./cart-trigger";
import { CartSheet } from "../../cart/cart-sheet";

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

      <header className="sticky top-0 z-50 w-full border-b-2 border-emerald-950/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <MobileMenu />

          <div className="mr-8 hidden lg:flex">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-emerald-950 rounded-none flex items-center justify-center transition-transform group-hover:rotate-3">
                <span className="text-amber-400 font-black text-xs tracking-tighter">
                  TS
                </span>
              </div>
              <span className="text-xl font-black uppercase tracking-tighter italic text-emerald-950">
                Terrace Shop
              </span>
            </Link>
          </div>

          <div className="flex-1 lg:hidden flex justify-center">
            <Link
              href="/"
              className="text-lg font-black uppercase tracking-tighter italic text-emerald-950"
            >
              Terrace Shop
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            <Link
              href="/search"
              className="text-sm font-bold uppercase tracking-wide text-zinc-600 hover:text-emerald-950 hover:underline decoration-2 underline-offset-4 transition-all"
            >
              New Arrivals
            </Link>
            <Link
              href="/search/jackets"
              className="text-sm font-bold uppercase tracking-wide text-zinc-600 hover:text-emerald-950 hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Outerwear
            </Link>
            <Link
              href="/search/hoodies"
              className="text-sm font-bold uppercase tracking-wide text-zinc-600 hover:text-emerald-950 hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Hoodies
            </Link>
            <Link
              href="/search/t-shirts"
              className="text-sm font-bold uppercase tracking-wide text-zinc-600 hover:text-emerald-950 hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Summer
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-1 lg:flex-none">
            <UserMenu user={session?.user} />
            <CartTrigger quantity={cart?.totalQuantity || 0} />
          </div>
        </div>
      </header>
    </>
  );
}
