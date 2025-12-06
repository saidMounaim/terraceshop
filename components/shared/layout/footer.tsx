import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-sm">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
              Terrace Shop
            </h3>
            <p className="text-zinc-400 font-medium leading-relaxed">
              Casual culture. Matchday essentials. <br />
              Est. 2025. No Pyro No Party.
            </p>
          </div>

          <div className="flex gap-12 text-sm font-bold uppercase tracking-wide">
            <div className="flex flex-col gap-3">
              <span className="text-zinc-500 mb-2">Shop</span>
              <Link
                href="/search"
                className="hover:text-amber-400 transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/search/jackets"
                className="hover:text-amber-400 transition-colors"
              >
                Outerwear
              </Link>
              <Link
                href="/search/sale"
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Sale
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-zinc-500 mb-2">Info</span>
              <Link
                href="/about"
                className="hover:text-amber-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/account"
                className="hover:text-amber-400 transition-colors"
              >
                My Account
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          <p>&copy; 2025 Terrace Shop. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">Twitter / X</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
