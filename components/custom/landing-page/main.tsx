"use client";

import { useSearchParams } from "next/navigation";
import { RenderIf } from "@/components/shared";
import { MainLanding, AllProviders } from "./main-sections";

export const MainSection = () => {
  const searchParams = useSearchParams();
  const searchVal = searchParams.get("q");

  return (
    <main className="w-full min-h-[100px]">
      <RenderIf condition={!searchVal}>
        <MainLanding />
      </RenderIf>

      <RenderIf condition={!!searchVal}>
        <AllProviders />
      </RenderIf>
    </main>
  );
};
