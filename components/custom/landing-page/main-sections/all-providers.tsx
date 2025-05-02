"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconHospital,
  IconSearchVector,
  IconStarFull,
  IconStethoscope,
} from "@/components/icons";
import { Avatar, AvatarImage } from "@/components/ui";
import { PaginationCmp, RenderIf } from "@/components/shared";
import { Loader } from "@/components/shared/loader";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { useGetTableTotalPages } from "@/hooks/use-format-table-info";
import { cn } from "@/lib/utils";
import { useGetServiceProviders } from "@/services/hooks/queries/use-providers";
import {
  FetchedServiceProvidersCountType,
  FetchedServiceProvidersType,
} from "@/types/providers";
import Link from "next/link";

export const AllProviders = () => {
  const searchParams = useSearchParams();
  const searchVal = searchParams.get("q");

  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetServiceProviders<
    FetchedServiceProvidersType[]
  >({
    q: searchVal as string,
    page: page?.toString(),
    item_per_page: itemsPerPage.toString(),
  });

  const { data: otherProviders } = useGetServiceProviders<
    FetchedServiceProvidersType[]
  >({
    page: page?.toString(),
    item_per_page: itemsPerPage.toString(),
  });

  const { data: count } =
    useGetServiceProviders<FetchedServiceProvidersCountType>({
      component: "count",
      q: searchVal as string,
    });

  const { data: otherProvidersCount } =
    useGetServiceProviders<FetchedServiceProvidersCountType>({
      component: "count",
    });

  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setPage);

  return (
    <div className="w-full px-5 lg:px-25 py-7 md:py-12 grid gap-y-5">
      <RenderIf
        condition={count ? count?.total > 0 : data ? data?.length > 0 : false}
      >
        <h3 className="font-bold text-2xl md:text-3xl text-brand-1">
          Search Result
        </h3>
      </RenderIf>

      <RenderIf condition={isLoading}>
        <div className="min-h-50 w-full flex justify-center items-center">
          <Loader />
        </div>
      </RenderIf>

      <RenderIf condition={!isLoading}>
        <RenderIf
          condition={count ? count?.total === 0 || data?.length === 0 : false}
        >
          <div className="w-full flex flex-col items-center justify-center bg-red-light gap-y-1 text-center px-5 pb-4 rounded-lg">
            <IconSearchVector />
            <h4 className="font-semibold text-base md:text-lg text-brand-1">
              No Provider Found
            </h4>
            <p className="text-xs md:text-sm text-brand-2">
              Please modify your search to find the provider you are looking for
            </p>
          </div>

          <h4 className="font-bold text-2xl text-brand-1 pt-6">
            Other Providers
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-8 gap-y-3 md:gap-y-12">
            {otherProviders?.map((provider) => (
              <LandingProviderCard
                provider={provider}
                key={provider?.provider_data?.user_id}
              />
            ))}
          </div>

          <PaginationCmp
            onInputPage={(val) => handlePageChange(parseInt(val))}
            currentPage={page?.toString()}
            totalPages={useGetTableTotalPages({
              totalDataCount: otherProvidersCount?.total ?? 0,
              itemsPerPage: itemsPerPage,
            })}
          />
        </RenderIf>

        <RenderIf condition={count ? count?.total > 0 : false}>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 md:gap-x-8 gap-y-3 md:gap-y-12">
            {data?.map((provider) => (
              <LandingProviderCard
                provider={provider}
                key={provider?.provider_data?.user_id}
              />
            ))}
          </div>
        </RenderIf>
      </RenderIf>

      <RenderIf condition={!isLoading && (count ? count?.total > 0 : false)}>
        <PaginationCmp
          onInputPage={(val) => handlePageChange(parseInt(val))}
          currentPage={page?.toString()}
          totalPages={useGetTableTotalPages({
            totalDataCount: count?.total ?? 0,
            itemsPerPage: itemsPerPage,
          })}
        />
      </RenderIf>
    </div>
  );
};

const LandingProviderCard = ({
  provider,
  isOtherProvider,
}: {
  provider: FetchedServiceProvidersType;
  isOtherProvider?: boolean;
}) => {
  return (
    <Link
      href={`/provider/${provider?.provider_data?.user_id}?type=${provider?.provider_data?.user_type}&service_type=${provider?.provider_data?.account_service_type}`}
      className={cn(
        "border border-divider rounded-lg pt-1 px-1",
        isOtherProvider ? "pb-3" : "pb-3 md:pb-17"
      )}
    >
      <div className="relative">
        <Avatar className="rounded-sm w-full h-29 md:h-37">
          <AvatarImage
            src={
              provider?.provider_data?.avatar ||
              "/assets/blank-profile-picture.png"
            }
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

      <div className="px-1 py-2 grid gap-y-4.5">
        <div>
          <h4 className="font-medium text-base md:text-lg text-brand-1 capitalize">
            {provider?.provider_data?.name}
          </h4>

          <p className="capitalize text-xs md:text-sm text-brand-2">
            {provider?.provider_data?.specialty ||
              provider?.provider_data?.industry_name}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-0.5 text-xs text-brand-1">
            <RenderIf
              condition={
                provider?.provider_data?.user_type?.toLowerCase() !== "org"
              }
            >
              <IconStarFull className="fill-actions-amber size-4" />
              {provider?.provider_data?.rating ?? 0}
            </RenderIf>
          </div>

          <p className="font-medium text-xs">
            From {formatNumberWithCommas(provider?.charge_from as number)}
            /hr
          </p>
        </div>
      </div>
    </Link>
  );
};
