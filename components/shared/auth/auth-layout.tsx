import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Quote } from "lucide-react";

export default async function AuthLayout({
  children,
  title,
  subtitle,
  imageSrc = "/auth-bg.png",
}: {
  children: React.ReactNode;
  title: string;
  subtitle: React.ReactNode;
  imageSrc?: string;
}) {
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 xl:px-24 border-r-2 border-zinc-100">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 space-y-2">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-emerald-950 sm:text-5xl leading-[0.9]">
              {title}
            </h1>
            <div className="h-1 w-12 bg-amber-400 mb-4" />
            <div className="text-sm font-medium text-zinc-500">{subtitle}</div>
          </div>
          {children}
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-emerald-950 overflow-hidden">
        <Image
          src={imageSrc}
          alt="Terrace Culture"
          fill
          className="object-cover opacity-60 mix-blend-overlay hover:scale-105 transition-transform duration-[20s]"
          priority
        />

        <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-12 w-full max-w-xl">
          <Quote className="h-12 w-12 text-amber-400 mb-6 opacity-80" />
          <blockquote className="text-3xl font-black uppercase italic leading-tight text-white tracking-tight drop-shadow-lg">
            &quot;You can change your wife, your politics, your religion, but
            never, never can you change your favourite football team.&quot;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-2px w-8 bg-amber-400" />
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-200">
              Eric Cantona
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
