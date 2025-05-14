import SignIn from "@/components/custom/auth/sign-in";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="space-y-6 max-w-[650px] mx-auto w-full px-2">
      <div className="space-y-1 text-center">
        <h1 className="lg:text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-brand-2">
          Welcome back to care that fits your life
        </p>
      </div>
      <SignIn />
      <div className="text-center text-sm font-semibold">
        <span className="text-brand-btn-secondary">
          Do not have an account?{" "}
        </span>
        <Link
          href="/sign-up"
          className="text-brand-accent-2 underline transition-colors  hover:opacity-80 "
        >
          Sign up instead
        </Link>
      </div>
    </div>
  );
}
