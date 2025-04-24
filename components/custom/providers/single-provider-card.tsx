"use client";

import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
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
}
export const SingleProviderCard = (provider: Partial<ISingleProviderCard>) => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const user_type = searchParams.get("type") as "provider" | "org";

  const path = usePathname();

  const ProviderSpecialtyInfo = () => {
    return (
      <p className="text-[8px] md:text-xs text-brand-2 capitalize">
        {provider?.provider_data?.industry_name ||
          provider?.provider_data?.specialty}
      </p>
    );
  };

  return (
    <Link
      href={
        provider?.provider_data?.user_type.toLowerCase() === "org" && !user_type
          ? `/providers/organisation/${provider?.provider_data?.user_id}?type=${provider?.provider_data?.user_type}&service_type=${provider?.provider_data?.account_service_type}`
          : provider?.provider_data?.user_type.toLowerCase() === "provider"
          ? `/providers/individual/${provider?.provider_data?.user_id}?type=${provider?.provider_data?.user_type}&service_type=${provider?.provider_data?.account_service_type}`
          : `/providers/organisation/${id}/single/${provider?.provider_data?.user_id}?type=${provider?.provider_data?.user_type}&service_type=${provider?.provider_data?.account_service_type}&user_type=provider&user_service_type=provider`
      }
      className="border border-divider rounded-lg p-1"
    >
      <div className="relative">
        <Avatar className="rounded-sm w-full h-20 md:h-32">
          <AvatarImage
            src={
              provider?.provider_data?.avatar ||
              "/assets/blank-profile-picture.png"
            }
            className="w-full object-cover hover:scale-150 transition-transform transform duration-200"
            alt="provider"
          />
        </Avatar>

        <RenderIf condition={path !== "/favourite-providers"}>
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
        </RenderIf>
      </div>

      <div className="grid gap-y-4 py-1 px-0.5">
        <div className="grid gap-y-0.5">
          <h2 className="font-medium text-brand-1 text-[10px] md:text-base">
            {provider?.provider_data?.name}
          </h2>

          <RenderIf
            condition={
              provider?.provider_data?.user_type.toLowerCase() !== "org" ||
              !user_type
            }
          >
            <ProviderSpecialtyInfo />
          </RenderIf>
        </div>

        <div className="flex items-center justify-between">
          <RenderIf
            condition={
              provider?.provider_data?.user_type.toLowerCase() === "org" &&
              !!user_type
            }
          >
            <ProviderSpecialtyInfo />
          </RenderIf>

          <div className="flex items-center gap-x-0.5 text-xs text-brand-1">
            <IconStarFull className="fill-actions-amber size-4" />
            {provider?.provider_data?.rating ?? 0}
          </div>

          <RenderIf
            condition={
              path !== "/favourite-providers" &&
              (provider?.provider_data?.user_type.toLowerCase() !== "org" ||
                !user_type)
            }
          >
            <p className="font-medium text-xs">
              From {formatNumberWithCommas(provider?.charge_from as number)}/hr
            </p>
          </RenderIf>
        </div>
      </div>
    </Link>
  );
};
