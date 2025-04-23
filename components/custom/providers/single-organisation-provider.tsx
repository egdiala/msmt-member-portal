"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IconList, IconList2, IconStarFull } from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Avatar, AvatarImage, Button } from "@/components/ui";
import { EmptyState } from "@/components/shared/empty-state";
import { Loader } from "@/components/shared/loader";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { useGetTableTotalPages } from "@/hooks/use-format-table-info";
import { PROVIDERS_TABLE_HEADERS } from "@/lib/constants";
import { formatTableDate } from "@/lib/utils";
import {
  useGetOrganizationProviders,
  useGetServiceProviders,
} from "@/services/hooks/queries/use-providers";
import {
  FetchedServiceProvidersCountType,
  FetchedSingleOrganizationProviders,
  FetchOrganizationProvider,
} from "@/types/providers";
import { FilterOrganisationsProvidersPopover } from "./filter-organisations-providers-popover";
import { SingleProviderCard } from "./single-provider-card";

export const SingleOrganisationProviderContent = () => {
  const { id } = useParams();

  const searchParams = useSearchParams();
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_type = searchParams.get("service_type") as "provider" | "payer";

  const { value, onChangeHandler } = useDebounce(400);

  const { data } = useGetServiceProviders<FetchOrganizationProvider>({
    user_id: id?.toString(),
    user_type: user_type,
    account_service_type: account_type,
  });

  const { data: providers, isLoading } = useGetOrganizationProviders<
    FetchedSingleOrganizationProviders[]
  >({
    org_id: id!.toString(),
    q: value,
  });

  const { data: providersCount } =
    useGetOrganizationProviders<FetchedServiceProvidersCountType>({
      org_id: id!.toString(),
      component: "count",
    });

  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setPage);

  const cardStats = [
    {
      id: 1,
      title: account_type === "provider" ? "Charge" : "Total Members",
      value:
        account_type === "provider"
          ? `From ${formatNumberWithCommas(data?.charge_from ?? 0)}/hr`
          : data?.total_member ?? 0,
    },
    { id: 2, title: "Providers", value: data?.total_provider ?? 0 },
  ];

  const [showGridView, setShowGridView] = useState(true);

  const tableData = providers?.map((provider) => {
    return {
      id: provider.provider_id,
      date_and_time: (
        <p className="text-brand-2">{formatTableDate(provider.createdAt)}</p>
      ),
      name: <p className="capitalize">{provider?.user_data?.name}</p>,
      specialty: <p className="capitalize">{provider?.user_data?.specialty}</p>,
      rating: provider?.rating,
      type: <p className="capitalize">individual</p>,
      charge_from: (
        <p className="capitalize">
          {formatNumberWithCommas(provider?.user_data?.charge_from ?? 0)}
        </p>
      ),
    };
  });

  return (
    <>
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers", href: "/providers" },
          { id: 2, name: data?.name ?? "" },
        ]}
      />

      <div className="bg-white rounded-2xl p-3 md:p-4 grid gap-y-5">
        <RenderIf condition={isLoading}>
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        </RenderIf>
        <RenderIf condition={!isLoading}>
          <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
            <Avatar className="w-full md:w-39 h-39 rounded-sm">
              <AvatarImage
                className="object-cover"
                src={data?.avatar || "/assets/blank-profile-picture.png"}
              />
            </Avatar>

            <div className="grid gap-y-3 w-full items-center">
              <div className="grid gap-y-1">
                <h3 className="text-lg md:text-xl font-bold text-brand-1">
                  {data?.name}
                </h3>
                <p className="text-brand-2">{data?.industry_name}</p>
              </div>

              <RenderIf condition={account_type === "provider"}>
                <div className="border-t border-divider"></div>

                <div className="flex items-center justify-between">
                  <Button variant="ghost" className="p-0 font-semibold">
                    <IconStarFull className="stroke-brand-btn-secondary size-4" />
                    Mark as Favourite
                  </Button>
                </div>
              </RenderIf>
            </div>
          </div>

          <div className="border border-divider rounded-lg px-4 md:px-5 py-4 grid gap-y-2">
            <p className="text-sm text-brand-2">About</p>
            <p className="text-brand-1">
              Has 0 years of professional experience with 3 publications and 3
              certifications
            </p>
          </div>

          <div className="border border-divider rounded-lg px-3 md:px-5 py-4 grid gap-y-2">
            <p className="text-brand-2 text-sm">Services</p>

            <div className="flex gap-4 flex-wrap">
              {data?.service_data?.map((service) => (
                <div
                  key={service?.service_offer_id}
                  className="rounded-full bg-grey-400 px-4 py-2.5 capitalize"
                >
                  {service?.name}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cardStats.map((stat) => (
              <div
                key={stat.id}
                className="grid gap-2 border border-divider rounded-lg px-5 py-4"
              >
                <p className="text-brand-2 text-sm">{stat.title}</p>
                <p className="text-lg text-brand-1 font-medium">{stat.value}</p>
              </div>
            ))}
          </div>
        </RenderIf>
      </div>

      <div className="bg-white w-full rounded-2xl p-4 md:p-6 grid gap-y-4 md:gap-y-5">
        <RenderIf condition={showGridView}>
          <h3 className="font-bold text-brand-1">Providers</h3>
        </RenderIf>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-between">
          <Searchbar onChange={onChangeHandler} placeholder="Search" />

          <div className="flex items-center gap-x-2">
            <Button
              variant="outline"
              className="hidden md:inline-flex w-fit h-fit py-2 px-3 rounded-2xl"
              onClick={() => setShowGridView(!showGridView)}
            >
              <RenderIf condition={showGridView}>
                <IconList2 className="stroke-brand-btn-secondary size-4" />
              </RenderIf>

              <RenderIf condition={!showGridView}>
                <IconList className="stroke-brand-btn-secondary size-4" />
              </RenderIf>
            </Button>

            <FilterOrganisationsProvidersPopover />
          </div>
        </div>

        <RenderIf condition={!showGridView}>
          <TableCmp
            data={tableData ?? []}
            headers={PROVIDERS_TABLE_HEADERS}
            isLoading={isLoading}
            emptyStateTitleText="There are no providers yet"
          />

          <RenderIf condition={tableData?.length !== 0}>
            <div className="grid md:hidden gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {providers?.map((provider) => (
                <SingleProviderCard
                  key={provider?.provider_id}
                  provider_data={{
                    name: provider?.user_data?.name,
                    avatar: provider?.user_data?.avatar,
                    user_type: "org",
                    account_type: "individual",
                    account_service_type: "payer",
                    user_id: provider?.provider_id,
                    specialty: provider?.user_data?.specialty,
                    createdAt: provider?.createdAt,
                    rating: provider?.rating?.toString(),
                  }}
                  charge_from={0}
                />
              ))}
            </div>
          </RenderIf>
        </RenderIf>

        <RenderIf condition={showGridView}>
          <RenderIf condition={isLoading}>
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          </RenderIf>

          <RenderIf condition={!isLoading}>
            <RenderIf condition={tableData?.length === 0}>
              <EmptyState
                title="Organization providers"
                subtitle="There are no providers yet"
                hasIcon
              />
            </RenderIf>

            <RenderIf condition={tableData?.length !== 0}>
              <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {providers?.map((provider) => (
                  <SingleProviderCard
                    key={provider?.provider_id}
                    provider_data={{
                      name: provider?.user_data?.name,
                      avatar: provider?.user_data?.avatar,
                      user_type: "org",
                      account_type: "individual",
                      account_service_type: "payer",
                      user_id: provider?.provider_id,
                      specialty: provider?.user_data?.specialty,
                      createdAt: provider?.createdAt,
                      rating: provider?.rating?.toString(),
                    }}
                    charge_from={0}
                  />
                ))}
              </div>
            </RenderIf>
          </RenderIf>
        </RenderIf>

        <RenderIf condition={!isLoading && tableData!.length > 0}>
          <PaginationCmp
            onInputPage={(val) => handlePageChange(parseInt(val))}
            currentPage={page?.toString()}
            totalPages={useGetTableTotalPages({
              totalDataCount: providersCount?.total ?? 0,
              itemsPerPage: itemsPerPage,
            })}
          />
        </RenderIf>
      </div>
    </>
  );
};
