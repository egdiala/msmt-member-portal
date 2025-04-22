"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { IconList, IconList2, IconStarFull } from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
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

  const { data } = useGetServiceProviders<FetchOrganizationProvider>({
    user_id: id?.toString(),
    user_type: "payer",
  });

  const { data: providers } = useGetOrganizationProviders<
    FetchedSingleOrganizationProviders[]
  >({
    org_id: id!.toString(),
  });

  const { data: providersCount } =
    useGetOrganizationProviders<FetchedServiceProvidersCountType>({
      org_id: id!.toString(),
      component: "count",
    });

  const cardStats = [
    {
      id: 1,
      title: "Completed appointment",
      value: data?.completed_appointment ?? 0,
    },
    { id: 2, title: "Providers", value: providersCount?.total ?? 0 },
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
        <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
          <Avatar className="w-full md:w-39 h-39 rounded-sm">
            <AvatarImage className="object-cover" src={data?.avatar} />
            <AvatarFallback className="text-5xl">
              {data?.name?.split(" ")[0][0]}
              {data?.name?.split(" ")[1][0]}
            </AvatarFallback>
          </Avatar>

          <div className="grid gap-y-3 w-full">
            <div className="grid gap-y-1">
              <h3 className="text-xl font-bold text-brand-1">{data?.name}</h3>
              <p className="text-brand-2">{data?.industry_data?.name}</p>
              {/* <div className="flex items-center gap-x-1 text-sm text-brand-1">
                <IconStarFull className="fill-actions-amber size-5" />
                4.5
              </div> */}
            </div>

            <div className="border-t border-divider"></div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" className="p-0 font-semibold">
                <IconStarFull className="stroke-brand-btn-secondary size-4" />
                Mark as Favourite
              </Button>
            </div>
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
      </div>

      <div className="bg-white w-full rounded-2xl p-4 md:p-6 grid gap-y-4 md:gap-y-5">
        <RenderIf condition={showGridView}>
          <h3 className="font-bold text-brand-1">Providers</h3>
        </RenderIf>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-between">
          <Searchbar onChange={() => {}} placeholder="Search" />

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
          <TableCmp data={tableData ?? []} headers={PROVIDERS_TABLE_HEADERS} />

          <div className="grid md:hidden gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {providers?.map((provider) => (
              <SingleProviderCard
                key={provider?.provider_id}
                isOrganisation
                provider_data={{
                  name: provider?.user_data?.name,
                  avatar: provider?.user_data?.avatar,
                  user_type: "org",
                  account_type: "individual",
                  user_id: provider?.provider_id,
                  specialty: provider?.user_data?.specialty,
                  createdAt: provider?.createdAt,
                }}
                user_type="individual"
                charge_from={provider?.user_data?.charge_from}
              />
            ))}
          </div>
        </RenderIf>

        <RenderIf condition={showGridView}>
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {providers?.map((provider) => (
              <SingleProviderCard
                key={provider?.provider_id}
                isOrganisation
                provider_data={{
                  name: provider?.user_data?.name,
                  avatar: provider?.user_data?.avatar,
                  user_type: "individual",
                  account_type: "",
                  user_id: provider?.provider_id,
                  specialty: provider?.user_data?.specialty,
                  createdAt: provider?.createdAt,
                }}
                user_type="individual"
                charge_from={provider?.user_data?.charge_from}
              />
            ))}
          </div>
        </RenderIf>

        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"1"}
          totalPages={"30"}
        />
      </div>
    </>
  );
};
