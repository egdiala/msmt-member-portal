"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { IconList, IconList2, IconStarFull } from "@/components/icons";
import {
  BreadcrumbCmp,
  FilterTag,
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
import {
  PROVIDER_FILTER_KEY_MATCH,
  PROVIDERS_TABLE_HEADERS,
} from "@/lib/constants";
import { cn, formatTableDate } from "@/lib/utils";
import {
  useGetOrganizationProviders,
  useGetServiceProviders,
} from "@/services/hooks/queries/use-providers";
import {
  useGetProfile,
  useMultipleRequestVariables,
} from "@/services/hooks/queries/use-profile";
import {
  useAddFavouriteProvider,
  useRemoveFavouriteProvider,
} from "@/services/hooks/mutations/use-providers";
import {
  FetchedServiceProvidersCountType,
  FetchedSingleOrganizationProviders,
  FetchOrganizationProvider,
} from "@/types/providers";
import { UserProfileType } from "@/types/profile";
import { FilterOrganisationsProvidersPopover } from "./filter-organisations-providers-popover";
import { SingleProviderCard } from "./single-provider-card";

export const SingleOrganisationProviderContent = ({
  isPublic,
}: {
  isPublic?: boolean;
}) => {
  const { id } = useParams();

  const searchParams = useSearchParams();
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_type = searchParams.get("service_type") as "provider" | "payer";
  const member_id = searchParams.get("member_id") as string;
  const service_offer_id = searchParams.get("service_offer_id") as string;

  const { value, onChangeHandler } = useDebounce(400);

  const { data: userProfile } = useGetProfile();
  const [user, setUser] = useState<UserProfileType>();

  useEffect(() => {
    if (window !== undefined) {
      setUser(JSON.parse(localStorage.getItem("user") as string));
    }
  }, []);

  const { data, isLoading: isLoadingServiceProviderInfo } =
    useGetServiceProviders<FetchOrganizationProvider>({
      user_id: id?.toString(),
      user_type: user_type,
      account_service_type: account_type,
      member_id: userProfile?.user_id,
      residence_country: user?.residence_country,
    });

  const [filters, setFilters] = useState<Record<string, any>>({});
  const { data: requestVariables } = useMultipleRequestVariables([
    "service-offering",
    "service-category",
  ]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCommunicationPreference, setSelectedCommunicationPreference] =
    useState("");
  const [selectedApptDate, setSelectedApptDate] = useState("");

  const handleClearAllFilters = () => {
    setSelectedService("");
    setSelectedCommunicationPreference("");
    setSelectedApptDate("");
  };

  const removeFilter = (filterToRemove: string) => {
    const setFilterValues: Record<string, any> = {
      service_offer_id: setSelectedService,
      appt_date: setSelectedApptDate,
      time_zone: setSelectedApptDate,
      comm_mode: setSelectedCommunicationPreference,
    };

    setFilters((prev) => {
      if (filterToRemove === "appt_date" || filterToRemove === "time_zone") {
        // eslint-disable-next-line
        const { appt_date: _, time_zone: __, ...rest } = prev;
        return rest;
      } else {
        // eslint-disable-next-line
        const { [filterToRemove]: _, ...rest } = prev;
        return rest;
      }
    });

    setFilterValues[filterToRemove]("");
  };

  const { data: providers, isLoading } = useGetOrganizationProviders<
    FetchedSingleOrganizationProviders[]
  >({
    org_id: id!.toString(),
    ...(value ? { q: value } : {}),
    ...(isPublic ? { service_offer_id: service_offer_id } : {}),
    member_id: isPublic ? member_id : userProfile?.user_id,
    ...filters,
  });

  const { data: providersCount } =
    useGetOrganizationProviders<FetchedServiceProvidersCountType>({
      org_id: id!.toString(),
      member_id: isPublic ? member_id : userProfile?.user_id,
      component: "count",
      ...filters,
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

  const { mutate: addFavourite, isPending } = useAddFavouriteProvider();
  const { mutate: removeFavourite, isPending: isRemovingFavourite } =
    useRemoveFavouriteProvider();

  const handleMarkAsFavourite = () => {
    if (data?.isfav_provider) {
      removeFavourite(id!.toString());
    } else {
      addFavourite(id!.toString());
    }
  };

  const buttonCopy = {
    idle: (
      <div className="flex items-center justify-between gap-x-2 px-3 py-2">
        <IconStarFull className="size-4" />
        <p>
          {data?.isfav_provider ? "Remove from Favourite" : "Mark as Favourite"}
        </p>
      </div>
    ),
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isRemovingFavourite ? "loading" : "idle";
  }, [isPending, isRemovingFavourite]);

  return (
    <>
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers", href: "/providers" },
          { id: 2, name: data?.name ?? "" },
        ]}
      />

      <div className="bg-white rounded-2xl p-3 md:p-4 grid gap-y-5">
        <RenderIf condition={isLoadingServiceProviderInfo}>
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        </RenderIf>
        <RenderIf condition={!isLoadingServiceProviderInfo}>
          <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
            <Avatar className="w-full md:w-39 h-39 rounded-sm">
              <AvatarImage
                className="object-cover"
                src={data?.avatar || "/assets/blank-profile-picture.png"}
              />
            </Avatar>

            <div className="grid gap-y-3 w-full items-center">
              <div className="grid gap-y-1 capitalize">
                <h3 className="text-lg md:text-xl font-bold text-brand-1">
                  {data?.name}
                </h3>
                <p className="text-brand-2">{data?.industry_name}</p>
              </div>

              <RenderIf condition={account_type === "provider"}>
                <div className="border-t border-divider"></div>

                <div className="flex items-center justify-between">
                  <Button
                    variant={data?.isfav_provider ? "default" : "ghost"}
                    className={cn(
                      "p-0 font-semibold min-w-42",
                      data?.isfav_provider
                        ? "stroke-white"
                        : "stroke-brand-btn-secondary hover:stroke-white"
                    )}
                    disabled={isPending || isRemovingFavourite}
                    onClick={handleMarkAsFavourite}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                        initial={{ opacity: 0, y: -25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 25 }}
                        key={buttonState}
                      >
                        {buttonCopy[buttonState]}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </div>
              </RenderIf>
            </div>
          </div>
          <RenderIf condition={!isPublic}>
            <div className="border border-divider rounded-lg px-4 md:px-5 py-4 grid gap-y-2">
              <p className="text-sm text-brand-2">About</p>
              <p className="text-brand-1">{data?.description ?? "N/A"}</p>
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
                  <p className="text-lg text-brand-1 font-medium">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </RenderIf>
        </RenderIf>
      </div>

      <div className="bg-white w-full rounded-2xl p-4 md:p-6 grid gap-y-4 md:gap-y-5">
        <RenderIf condition={showGridView}>
          <h3 className="font-bold text-brand-1">Providers</h3>
        </RenderIf>

        <RenderIf
          condition={
            (providersCount?.total || 0) > 0 || tableData?.length === 0
              ? false
              : true
          }
        >
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

              <FilterOrganisationsProvidersPopover
                setFilters={setFilters}
                requestVariables={requestVariables}
                selectedService={selectedService}
                selectedCommunicationPreference={
                  selectedCommunicationPreference
                }
                selectedApptDate={selectedApptDate}
                setSelectedService={setSelectedService}
                setSelectedCommunicationPreference={
                  setSelectedCommunicationPreference
                }
                setSelectedApptDate={setSelectedApptDate}
              />
            </div>
          </div>
        </RenderIf>

        <RenderIf condition={Object.keys(filters)?.length > 0}>
          <div className="flex flex-col md:flex-row flex-wrap justify-between items-end">
            <div className="flex flex-wrap gap-2">
              {Object.keys(filters)?.map((filter, index) => (
                <FilterTag
                  key={index}
                  title={PROVIDER_FILTER_KEY_MATCH[filter]}
                  value={
                    filter === "service_offer_id"
                      ? requestVariables["service-offering"]?.filter(
                          (val: { service_offer_id: string }) =>
                            val?.service_offer_id === filters[filter]
                        )[0]?.name
                      : filter === "service_cat_id"
                      ? requestVariables["service-category"]?.filter(
                          (val: { _id: string }) => val?._id === filters[filter]
                        )[0]?.name
                      : filters[filter]
                  }
                  onClear={() => removeFilter(filter)}
                />
              ))}

              <Button
                variant="link"
                className="underline underline-offset-1 text-button-primary text-xs"
                onClick={() => {
                  setFilters({});
                  handleClearAllFilters();
                }}
              >
                Clear all filters
              </Button>
            </div>
          </div>
        </RenderIf>

        <RenderIf condition={!showGridView}>
          <TableCmp
            data={tableData ?? []}
            headers={PROVIDERS_TABLE_HEADERS}
            isLoading={isLoading}
            emptyStateTitleText={
              (providersCount?.total || 0) > 0
                ? "Only members of this organisation can view the providers"
                : "There are no providers yet"
            }
          />

          <RenderIf condition={tableData?.length !== 0}>
            <div className="grid md:hidden gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {providers?.map((provider) => (
                <SingleProviderCard
                  key={provider?.provider_id}
                  provider_data={{
                    name: provider?.user_data?.name,
                    avatar: provider?.user_data?.avatar,
                    user_type: user_type,
                    account_type: "individual",
                    account_service_type: account_type,
                    user_id: provider?.provider_id,
                    specialty: provider?.user_data?.specialty,
                    createdAt: provider?.createdAt,
                    rating: provider?.rating?.toString(),
                  }}
                  charge_from={provider?.user_data?.charge_from}
                  serviceOfferId={service_offer_id ?? ""}
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
                title={
                  (providersCount?.total || 0) > 0
                    ? `Only members of ${data?.name} can view and book providers`
                    : "Organization providers"
                }
                subtitle={
                  (providersCount?.total || 0) > 0
                    ? ""
                    : "There are no providers yet"
                }
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
                      user_type: user_type,
                      account_type: "individual",
                      account_service_type: account_type,
                      user_id: provider?.provider_id,
                      specialty: provider?.user_data?.specialty,
                      createdAt: provider?.createdAt,
                      rating: provider?.rating?.toString(),
                    }}
                    charge_from={provider?.user_data?.charge_from}
                    serviceOfferId={service_offer_id ?? ""}
                  />
                ))}
              </div>
            </RenderIf>
          </RenderIf>
        </RenderIf>

        <RenderIf
          condition={!isLoading && tableData ? tableData?.length > 0 : false}
        >
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
