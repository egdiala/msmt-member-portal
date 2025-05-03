"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RenderIf } from "@/components/shared";
import { MainLanding, AllProviders } from "./main-sections";

export const MainSection = () => {
  const searchParams = useSearchParams();
  const [searchParamsArrLength, setSearchParamsArrLength] = useState(0);

  useEffect(() => {
    setSearchParamsArrLength(Array.from(searchParams.entries()).length);
  }, [searchParams]);

  return (
    <main className="w-full min-h-[100px]">
      <RenderIf condition={searchParamsArrLength === 0}>
        <MainLanding />
      </RenderIf>

      <RenderIf condition={searchParamsArrLength > 0}>
        <AllProviders />
      </RenderIf>
    </main>
  );
};
