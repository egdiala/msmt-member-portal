"use client";

import { useSearchParams } from "next/navigation";
import { RenderIf } from "@/components/shared";
import {
  SingleIndividualProviderContent,
  SingleOrganisationProviderContent,
} from "./provider";

export const SingleProvider = () => {
  const searchParams = useSearchParams();
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_type = searchParams.get("service_type") as "provider" | "payer";

  return (
    <div className="bg-white grid gap-y-5">
      <RenderIf
        condition={user_type === "provider" && account_type === "provider"}
      >
        <SingleIndividualProviderContent />
      </RenderIf>

      <RenderIf
        condition={user_type !== "provider" && account_type !== "provider"}
      >
        <SingleOrganisationProviderContent />
      </RenderIf>
    </div>
  );
};
