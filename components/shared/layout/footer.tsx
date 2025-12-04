import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold uppercase tracking-tighter">
              Terrace Shop
            </h3>
            <p className="text-sm text-zinc-400 max-w-xs">
              Born on the terraces. Est. 2025. Premium casual wear for the
              modern supporter.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                IG
              </div>
              <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                X
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="/search" className="hover:text-white">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/search/jackets" className="hover:text-white">
                  Outerwear
                </Link>
              </li>
              <li>
                <Link href="/search/shoes" className="hover:text-white">
                  Trainers
                </Link>
              </li>
              <li>
                <Link
                  href="/search/sale"
                  className="hover:text-white text-red-500"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link href="/pages/shipping" className="hover:text-white">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/pages/size-guide" className="hover:text-white">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/pages/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/pages/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider mb-6">
              Stay in the loop
            </h4>
            <p className="text-sm text-zinc-400 mb-4">
              Subscribe for drops and away day guides.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="EMAIL"
                className="bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm w-full focus:outline-none focus:border-white transition-colors"
              />
              <button className="bg-white text-black text-xs font-bold px-4 py-2 uppercase hover:bg-zinc-200">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500 uppercase">
            &copy; 2025 Terrace Shop. No Pyro No Party.
          </p>
          <div className="flex gap-4 opacity-50 grayscale">
            <div className="h-6 w-10 bg-zinc-800 rounded"></div>
            <div className="h-6 w-10 bg-zinc-800 rounded"></div>
            <div className="h-6 w-10 bg-zinc-800 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
