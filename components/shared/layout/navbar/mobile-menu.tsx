"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Suspense, useState } from "react";

const links = [
  { href: "/search", label: "New Arrivals" },
  { href: "/search/jackets", label: "Outerwear" },
  { href: "/search/shoes", label: "Trainers" },
  { href: "/search/accessories", label: "Accessories" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Suspense>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetTitle className="text-left text-lg font-extrabold uppercase tracking-tighter">
            Terrace Shop
          </SheetTitle>
          <nav className="flex flex-col gap-4 mt-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg font-bold uppercase tracking-wide hover:text-zinc-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-8 border-t pt-8">
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-zinc-500 hover:text-black mb-4"
              >
                My Account
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </Suspense>
  );
}
