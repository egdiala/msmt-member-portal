"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("q") as string);
  }, [searchParams]);

  return (
    <header
      className={cn(
        "flex justify-between items-center px-5 md:px-12 py-2 md:py-5 w-full sticky z-50 top-0 left-0 right-0",
        pathname.startsWith("/available-providers") || search
          ? "bg-white"
          : "bg-blue-400"
      )}
    >
      <Image src="/assets/logo.svg" alt="Logo" width={40} height={40} />

      <div className="flex items-center gap-x-6">
        <Button asChild variant="secondary" className="shadow-none">
          <Link href="/sign-in">Sign in</Link>
        </Button>

        <Button>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </header>
  );
};
