"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock } from "lucide-react";

type LoginFormValues = z.infer<typeof signInSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      setLoading(false);
      setError("Invalid email or password.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-xs font-black tracking-widest text-emerald-950">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="h-12 rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 font-bold focus:border-emerald-950 focus:ring-0 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-bold uppercase text-red-600" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="uppercase text-xs font-black tracking-widest text-emerald-950">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-12 rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 font-bold focus:border-emerald-950 focus:ring-0 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-bold uppercase text-red-600" />
            </FormItem>
          )}
        />

        {error && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 text-sm font-bold text-amber-900 rounded-none">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-14 w-full rounded-none bg-emerald-950 text-white font-black uppercase tracking-widest hover:bg-emerald-900 border-2 border-transparent hover:border-amber-400 transition-all"
        >
          {loading ? (
            "Signing in..."
          ) : (
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Sign In
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
