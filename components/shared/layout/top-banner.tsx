import Link from "next/link";
import { AlertTriangle, Github } from "lucide-react";

export function TopBanner() {
  return (
    <div className="bg-amber-400 px-4 py-2 text-black">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 text-center text-xs font-bold uppercase tracking-wide sm:text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>
          Test Store Only — No orders will be fulfilled. Source code available
          on{" "}
        </span>
        <Link
          href="https://github.com/saidMounaim/terraceshop"
          target="_blank"
          className="flex items-center gap-1 underline underline-offset-4 hover:text-emerald-950"
        >
          <Github className="h-4 w-4" /> GitHub
        </Link>
      </div>
    </div>
  );
}
