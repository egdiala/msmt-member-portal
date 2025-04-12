import Link from "next/link";
import ResetPassword from "@/components/custom/auth/reset-password";

export default function SignInPage() {
  return (
    <div className="space-y-6 max-w-[650px] mx-auto w-full px-2">
      <div className="space-y-1 text-center">
        <h1 className="lg:text-2xl text-brand-1 font-bold">Enter Your Email</h1>
        <p className="text-sm text-brand-2">
          Enter the email associated with your account. We would send password
          reset instructions to your email
        </p>
      </div>

      <ResetPassword />

      <div className="text-center text-sm font-semibold">
        <span className="text-brand-btn-secondary">
          Already have an account {""}
        </span>
        <Link
          href="/sign-in"
          className="text-brand-accent-2 underline transition-colors  hover:opacity-80 "
        >
          Sign in Instead
        </Link>
      </div>
    </div>
  )
}
