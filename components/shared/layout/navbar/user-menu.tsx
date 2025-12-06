"use client";

import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu({ user }: { user?: User }) {
  if (!user) {
    return (
      <Button
        asChild
        variant="ghost"
        className="font-bold uppercase tracking-wide hover:bg-zinc-100 rounded-none text-emerald-950"
      >
        <Link href="/login">Sign In</Link>
      </Button>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TS";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-none hover:bg-transparent px-0"
        >
          <Avatar className="h-8 w-8 rounded-none border border-transparent hover:border-emerald-950 transition-colors">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-emerald-950 text-amber-400 font-bold rounded-none">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-none border-2 border-zinc-100 shadow-xl p-0"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal bg-zinc-50 p-4 border-b border-zinc-100">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black uppercase tracking-tight text-emerald-950">
              {user.name}
            </p>
            <p className="text-xs font-medium text-zinc-500 truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <div className="p-2">
          <DropdownMenuItem
            asChild
            className="rounded-none cursor-pointer focus:bg-emerald-50 focus:text-emerald-950"
          >
            <Link
              href="/account"
              className="flex items-center gap-2 font-bold uppercase text-xs tracking-wide"
            >
              My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="rounded-none cursor-pointer focus:bg-emerald-50 focus:text-emerald-950"
          >
            <Link
              href="/account/orders"
              className="flex items-center gap-2 font-bold uppercase text-xs tracking-wide"
            >
              Order History
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-zinc-100 my-0" />

        <div className="p-2">
          <DropdownMenuItem
            className="rounded-none cursor-pointer text-red-600 focus:text-white focus:bg-red-600 font-bold uppercase text-xs tracking-wide"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
