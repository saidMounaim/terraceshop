import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-[10rem] font-black leading-none tracking-tighter text-zinc-200 sm:text-[14rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-emerald-950 px-6 py-2 text-2xl font-black uppercase italic tracking-widest text-amber-400 -rotate-3 transform shadow-xl">
            Match Abandoned
          </span>
        </div>
      </div>

      <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-emerald-950">
        Lost in the stands?
      </h2>

      <p className="mb-10 max-w-md text-lg font-medium text-zinc-500">
        The page you are looking for has been moved, removed, or never existed.
        Head back to the main stand.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          asChild
          className="h-14 rounded-none border-2 border-emerald-950 bg-emerald-950 px-8 text-base font-bold uppercase tracking-widest text-white hover:bg-emerald-900 hover:text-amber-400 transition-colors"
        >
          <Link href="/">
            <MoveLeft className="mr-2 h-4 w-4" /> Return Home
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-14 rounded-none border-2 border-zinc-300 bg-transparent px-8 text-base font-bold uppercase tracking-widest text-zinc-900 hover:border-emerald-950 hover:bg-white"
        >
          <Link href="/search">
            <Search className="mr-2 h-4 w-4" /> Browse Shop
          </Link>
        </Button>
      </div>
    </div>
  );
}
