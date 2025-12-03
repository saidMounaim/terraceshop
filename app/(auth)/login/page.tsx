"use client";

import AuthLayout from "@/components/shared/auth/auth-layout";
import GoogleLoginForm from "@/components/shared/forms/google-login-form";
import LoginForm from "@/components/shared/forms/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          New to Terrace Shop?{" "}
          <Link
            href="/register"
            className="font-medium text-black underline hover:text-gray-700"
          >
            Create an account
          </Link>
        </>
      }
    >
      <div className="grid gap-6">
        <LoginForm />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleLoginForm />
      </div>
    </AuthLayout>
  );
}
