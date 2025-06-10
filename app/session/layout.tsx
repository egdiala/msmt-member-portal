import { SiteHeader } from "@/components/shared/auth-header";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="relative flex min-h-screen flex-col ">
        <SiteHeader />
        <main className="flex-1 py-8 lg:py-12 flex flex-col justify-center w-full bg-[#F3F5F9] px-4">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </Suspense>
  );
}
