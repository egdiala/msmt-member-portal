"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconHospital,
  IconStarFull,
  IconStethoscope,
} from "@/components/icons";
import { RenderIf } from "@/components/shared";
import { Avatar, AvatarImage } from "@/components/ui";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { cn } from "@/lib/utils";
import { FetchedServiceProvidersType } from "@/types/providers";

interface ISingleProviderCard extends FetchedServiceProvidersType {
  key: string;
  isOrganisation?: boolean;
}
export const SingleProviderCard = (provider: ISingleProviderCard) => {
  const { id } = useParams();
  return (
    <Link
      href={
        provider.isOrganisation
          ? `/providers/organisation/${id}/single/${provider?.provider_data?.user_id}`
          : provider?.provider_data?.account_type?.toLowerCase() ===
            "individual"
          ? `/providers/individual/${provider?.provider_data?.user_id}`
          : `/providers/organisation/${provider?.provider_data?.user_id}`
      }
      className="border border-divider rounded-lg p-1"
    >
      <div className="relative">
        <Avatar className="rounded-sm w-full h-20 md:h-32">
          <AvatarImage
            src={provider?.provider_data?.avatar}
            className="w-full object-cover hover:scale-150 transition-transform transform duration-200"
            alt="provider"
          />
        </Avatar>

        <div
          className={cn(
            "w-fit capitalize px-1 py-0.5 flex gap-x-1 text-xs text-brand-2 absolute top-1 left-1 rounded-sm",
            provider?.provider_data?.account_type?.toLowerCase() ===
              "individual"
              ? "bg-blue-400"
              : "bg-brand-bkg-3"
          )}
        >
          <RenderIf
            condition={
              provider?.provider_data?.account_type?.toLowerCase() ===
              "individual"
            }
          >
            <IconStethoscope className="stroke-brand-btn-secondary size-3" />
            {provider?.provider_data?.account_type}
          </RenderIf>

          <RenderIf
            condition={
              provider?.provider_data?.account_type?.toLowerCase() === "payer"
            }
          >
            <IconHospital className="stroke-brand-btn-secondary size-3" />
            Organization
          </RenderIf>
        </div>
      </div>

      <div className="grid gap-y-4 py-1 px-0.5">
        <div className="grid gap-y-0.5">
          <h2 className="font-medium text-brand-1 text-[10px] md:text-base">
            {provider?.provider_data?.name}
          </h2>
          <p className="text-[8px] md:text-xs text-brand-2 capitalize">
            <RenderIf
              condition={
                provider?.provider_data?.account_type?.toLowerCase() === "payer"
              }
            >
              {provider?.industry_data?.name}
            </RenderIf>
            <RenderIf
              condition={
                provider?.provider_data?.account_type?.toLowerCase() !== "payer"
              }
            >
              {provider?.provider_data?.specialty}
            </RenderIf>
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-0.5 text-xs text-brand-1">
            <RenderIf
              condition={
                provider?.provider_data?.account_type?.toLowerCase() ===
                "individual"
              }
            >
              <IconStarFull className="fill-actions-amber size-4" />
              {provider?.provider_data?.rating ?? 0}
            </RenderIf>
          </div>

          <p className="font-medium text-xs">
            From {formatNumberWithCommas(provider?.charge_from)}/hr
          </p>
        </div>
      </div>
    </Link>
  );
};
