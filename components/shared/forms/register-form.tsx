"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { registerCustomer } from "@/lib/actions/auth";
import { RegisterSchema } from "@/lib/validations";
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
import { useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle } from "lucide-react";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: RegisterFormValues) {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);

      const result = await registerCustomer(null, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/login");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-black tracking-widest text-emerald-950">
                  First name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
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
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-black tracking-widest text-emerald-950">
                  Last name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    className="h-12 rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 font-bold focus:border-emerald-950 focus:ring-0 transition-colors"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs font-bold uppercase text-red-600" />
              </FormItem>
            )}
          />
        </div>

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
                  placeholder="Min 6 characters"
                  className="h-12 rounded-none border-2 border-zinc-200 bg-zinc-50 px-4 font-bold focus:border-emerald-950 focus:ring-0 transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs font-bold uppercase text-red-600" />
            </FormItem>
          )}
        />

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 p-3 text-sm font-bold text-red-900 rounded-none">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="mt-4 h-14 w-full rounded-none bg-emerald-950 text-white font-black uppercase tracking-widest hover:bg-emerald-900 border-2 border-transparent hover:border-amber-400 transition-all"
        >
          {isPending ? (
            "Creating account..."
          ) : (
            <span className="flex items-center gap-2">
              Create Account <ArrowRight className="h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
