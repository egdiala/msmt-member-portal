"use client";

import { useSearchParams } from "next/navigation";
import { SingleIndividualProviderContent } from "../providers";
import { RenderIf } from "@/components/shared";
import SingleOrganisationProvider from "@/app/(auth)/providers/organisation/[id]/page";

export const SingleProvider = () => {
  const searchParams = useSearchParams();
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_type = searchParams.get("service_type") as "provider" | "payer";

  return (
    <div>
      <RenderIf
        condition={user_type === "provider" && account_type === "provider"}
      >
        <SingleIndividualProviderContent />
      </RenderIf>

      <RenderIf
        condition={user_type !== "provider" && account_type !== "provider"}
      >
        <SingleOrganisationProvider />
      </RenderIf>
    </div>
  );
};
