"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RenderIf } from "@/components/shared";
import { MainLanding, AllProviders } from "./main-sections";

export const MainSection = () => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("q") as string);
  }, [searchParams]);

  return (
    <main className="w-full min-h-[100px]">
      <RenderIf condition={!search}>
        <MainLanding />
      </RenderIf>

      <RenderIf condition={!!search}>
        <AllProviders />
      </RenderIf>
    </main>
  );
};
