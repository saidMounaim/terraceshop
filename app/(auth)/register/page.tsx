import Link from "next/link";
import RegisterForm from "@/components/shared/forms/register-form";
import AuthLayout from "@/components/shared/auth/auth-layout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-black underline underline-offset-4 hover:text-gray-600"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
