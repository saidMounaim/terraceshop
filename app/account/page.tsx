import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account | Terrace Shop",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TS";

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:py-24">
      <div className="mb-12 border-b-2 border-emerald-950 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-emerald-950 italic sm:text-5xl leading-[0.9]">
            Club Profile
          </h1>
          <p className="mt-2 font-medium text-emerald-800/70">
            Manage your details and view matchday history.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-100 px-4 py-2 border-2 border-zinc-200">
          <ShieldCheck className="h-5 w-5 text-emerald-900" />
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Official Member
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="h-max md:col-span-1 rounded-none border-2 border-emerald-950 bg-emerald-950 text-white shadow-xl">
          <CardHeader className="border-b border-emerald-900/50 pb-6">
            <div className="h-16 w-16 bg-amber-400 text-emerald-950 flex items-center justify-center text-2xl font-black rounded-none mb-4">
              {initials}
            </div>
            <CardTitle className="text-xl font-black uppercase tracking-tight">
              {user.name}
            </CardTitle>
            <CardDescription className="text-emerald-400/80 font-mono text-xs">
              {user.email}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/account/orders" className="group block h-full">
            <Card className="h-full rounded-none border-2 border-zinc-200 bg-white transition-all duration-300 hover:border-amber-400 hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 h-12 w-12 bg-zinc-100 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                  <Package className="h-6 w-6 text-zinc-900" />
                </div>
                <CardTitle className="text-lg font-black uppercase tracking-tight text-emerald-950">
                  Order History
                </CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Track packages & returns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-emerald-950 group-hover:underline decoration-2 underline-offset-4">
                  View Orders <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search" className="group block h-full">
            <Card className="h-full rounded-none border-2 border-zinc-200 bg-white transition-all duration-300 hover:border-amber-400 hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader>
                <div className="mb-4 h-12 w-12 bg-zinc-100 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                  <MapPin className="h-6 w-6 text-zinc-900" />
                </div>
                <CardTitle className="text-lg font-black uppercase tracking-tight text-emerald-950">
                  Addresses
                </CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Managed at Checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm font-bold uppercase text-emerald-950 group-hover:underline decoration-2 underline-offset-4">
                  Shop New Arrivals <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
