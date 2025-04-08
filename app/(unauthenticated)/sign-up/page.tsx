import Link from "next/link";
import SignUp from "@/components/custom/auth/sign-up";

export default function SignUpPage() {
  return (
        <div className="max-w-2xl mx-auto px-2">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-lg lg:text-2xl font-bold">Create an Account</h1>
              <p className="text-sm text-muted-foreground">
                Find expert support, schedule sessions, or grow your practice. Sign
                up in minutes.
              </p>
            </div>
    
            <SignUp />
    
            <div className="text-center text-sm font-semibold">
              <span className="text-brand-btn-secondary">
                Already have an account?{" "}
              </span>
              <Link
                href="/sign-in"
                className="text-brand-accent-2 underline transition-colors  hover:opacity-80"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
  )
}
