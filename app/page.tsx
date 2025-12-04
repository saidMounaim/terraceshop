import { auth } from "@/auth";
import SignOutButton from "@/components/shared/auth/signout-button";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <>
      {session ? (
        <>
          <div>Welcome back, {session.user?.name}!</div>
          <SignOutButton />
        </>
      ) : (
        <div>
          Welcome, please <Link href="/login">sign in</Link> or{" "}
          <Link href="/register">register</Link>.
        </div>
      )}
    </>
  );
}
