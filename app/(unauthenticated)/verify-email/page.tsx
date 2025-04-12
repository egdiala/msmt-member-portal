import VerifyEmail from "@/components/custom/auth/verify-email";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="max-w-sm lg:max-w-md mx-auto px-2">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-lg lg:text-2xl font-bold">Verify your Email</h1>
        </div>
        <Suspense>
          <VerifyEmail />
        </Suspense>
      </div>
    </div>
  )
}
