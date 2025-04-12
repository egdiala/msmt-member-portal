import { SiteHeader } from "@/components/shared/auth-header";
import { UnauthenticatedWrapper } from "@/components/custom/auth/unauthenticated-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UnauthenticatedWrapper>
      <div className="relative flex min-h-screen flex-col ">
        <SiteHeader />
        <main className="flex-1 py-8 lg:py-12 flex flex-col justify-center w-full bg-[#F3F5F9]">
          {children}
        </main>
      </div>
    </UnauthenticatedWrapper>
  );
}
