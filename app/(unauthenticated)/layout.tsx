import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RenderIf } from "@/components/shared";
import { SiteHeader } from "@/components/shared/auth-header";
import { isAuthenticated } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/home");
    }
  }, [isLoggedIn, router]);

  return (
    <RenderIf condition={!isLoggedIn}>
      <div className="relative flex min-h-screen flex-col ">
        <SiteHeader />
        <main className="flex-1 py-8 lg:py-12 flex flex-col justify-center w-full bg-[#F3F5F9]">
          {children}
        </main>
      </div>
    </RenderIf>
  );
}
