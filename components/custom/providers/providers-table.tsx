"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  IconClose,
  IconList,
  IconList2,
  IconListFilter,
} from "@/components/icons";
import {
  FilterTag,
  PaginationCmp,
  RenderIf,
  Searchbar,
  SelectCmp,
  TableCmp,
} from "@/components/shared";
import { Button } from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { EmptyState } from "@/components/shared/empty-state";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { useGetTableTotalPages } from "@/hooks/use-format-table-info";
import { cn } from "@/lib/utils";
import { PROVIDERS_TABLE_HEADERS } from "@/lib/constants";
import { useGetServiceProviders } from "@/services/hooks/queries/use-providers";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import {
  FetchedServiceProvidersCountType,
  FetchedServiceProvidersType,
} from "@/types/providers";
import { SingleProviderCard } from "./single-provider-card";
import { CalendarInput } from "../wallet/calendar-input";

export const ProvidersTable = () => {
  const [showGridView, setShowGridView] = useState(true);

  const { data: requestVariables } = useMultipleRequestVariables([
    "service-offering",
    "preferred-lan",
    "religion-list",
  ]);

  // filters
  const [apptDate, setApptDate] = useState(""); // appt_date (requires time_zone)
  const [providerType, setProviderType] = useState(""); // user_type
  const [specificService, setSpecificService] = useState(""); // service_offer_id or service_cat_id
  const [priceRange, setPriceRange] = useState(""); // amount
  const [gender, setGender] = useState(""); // gender (male | female)
  const [religion, setReligion] = useState("");
  const [language, setLanguage] = useState("");
  const [communicationPreference, setCommunicationPreference] = useState(""); //comm_mode

  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleApplyFilter = () => {
    setFilters({
      ...(apptDate ? { appt_date: apptDate } : {}),
      ...(apptDate ? { time_zone: new Date().getTimezoneOffset() } : {}),
      ...(providerType
        ? {
            user_type:
              providerType?.toLowerCase() === "organization"
                ? "org"
                : "provider",
          }
        : {}),
      ...(specificService
        ? {
            service_offer_id: requestVariables["service-offering"]?.filter(
              (val: { name: string }) => val?.name === specificService
            )[0]?.service_offer_id,
          }
        : {}),
      ...(priceRange ? { amount: priceRange } : {}),
      ...(gender ? { gender: gender?.toLowerCase() } : {}),
      ...(language ? { language: language?.toLowerCase() } : {}),
      ...(religion ? { religion: religion?.toLowerCase() } : {}),
      ...(communicationPreference
        ? { comm_mode: communicationPreference?.toLowerCase() }
        : {}),
    });
  };

  const removeFilter = (filterToRemove: string) => {
    setFilters((prev) => {
      const { [filterToRemove]: _, ...rest } = prev;
      return rest;
    });
  };

  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const { value, onChangeHandler } = useDebounce(400);

  const { data, isLoading } = useGetServiceProviders<
    FetchedServiceProvidersType[]
  >({ ...(value ? { q: value?.toString() } : {}), ...filters });

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setPage);

  const { data: count } =
    useGetServiceProviders<FetchedServiceProvidersCountType>({
      component: "count",
    });

  const tableData = data?.map((provider) => {
    return {
      id: provider?.provider_data?.user_id,
      datum: provider,
      name: <p className="capitalize">{provider?.provider_data?.name}</p>,
      specialty: (
        <p className="capitalize">
          {provider?.provider_data?.specialty ||
            provider?.provider_data?.industry_name}
        </p>
      ),
      rating: provider?.provider_data?.rating,
      type: (
        <p className="capitalize">
          {provider?.provider_data?.account_type === "payer"
            ? "Organization"
            : provider?.provider_data?.account_type}
        </p>
      ),
      charge_from: (
        <p className="capitalize">
          {formatNumberWithCommas(provider?.charge_from)}
        </p>
      ),
    };
  });

  const router = useRouter();

  const [showFilterButtonOnly, setShowFilterButtonOnly] = useState(true);

  return (
    <>
      <div className="sticky top-100">
        <RenderIf condition={showFilterButtonOnly}>
          <Button
            variant="secondary"
            onClick={() => setShowFilterButtonOnly(!showFilterButtonOnly)}
            className="bg-white px-4 py-5 rounded-2xl w-fit hidden md:inline-flex"
          >
            <IconListFilter className="stroke-button-primary size-6" />
          </Button>
        </RenderIf>

        <RenderIf condition={!showFilterButtonOnly}>
          <div className="hidden md:grid rounded-2xl bg-white w-70 lg:w-94 p-4 gap-y-5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="p-0"
                  onClick={() => setShowFilterButtonOnly(!showFilterButtonOnly)}
                >
                  <IconListFilter className="stroke-brand-1 size-6" />
                </Button>

                <h3 className="font-bold">Filter</h3>
              </div>

              <Button
                variant="ghost"
                className="p-0"
                onClick={() => setShowFilterButtonOnly(!showFilterButtonOnly)}
              >
                <IconClose className="stroke-brand-2 size-6 hover:bg-button-primary rounded-full" />
              </Button>
            </div>

            <div className="grid gap-y-4">
              <CalendarInput
                value={apptDate === "" ? undefined : new Date(apptDate)}
                onChange={(date: any) => {
                  setApptDate(format(date, "yyy-MM-dd"));
                }}
                label="Available date"
              />

              <SelectCmp
                selectItems={[
                  { id: 1, value: "Provider" },
                  { id: 2, value: "Organization" },
                ]}
                onSelect={(val) => setProviderType(val)}
                placeholder={"Provider type"}
              />

              <SelectCmp
                selectItems={requestVariables["service-offering"]?.map(
                  (val: { service_offer_id: string; name: string }) => {
                    return { id: val?.service_offer_id, value: val?.name };
                  }
                )}
                onSelect={(val) => setSpecificService(val)}
                placeholder={"Specific service"}
              />

              <SelectCmp
                selectItems={[
                  { id: 1, value: "100-1000" },
                  { id: 2, value: "1000-5000" },
                  { id: 3, value: "5000-10000" },
                  { id: 4, value: "10000-20000" },
                  { id: 5, value: "20000-40000" },
                  { id: 6, value: "40000-60000" },
                  { id: 7, value: "60000-80000" },
                  { id: 8, value: "80000-100000" },
                ]}
                onSelect={(val) => setPriceRange(val)}
                placeholder={"Price range"}
              />

              <SelectCmp
                selectItems={[
                  { id: 1, value: "Male" },
                  { id: 2, value: "Female" },
                ]}
                onSelect={(val) => setGender(val)}
                placeholder={"Gender"}
              />

              <SelectCmp
                selectItems={requestVariables["preferred-lan"]?.map(
                  (val: string) => {
                    return {
                      id: val,
                      value: val,
                    };
                  }
                )}
                onSelect={(val) => setLanguage(val)}
                placeholder={"Language"}
              />

              <SelectCmp
                selectItems={requestVariables["religion-list"]?.map(
                  (val: string) => {
                    return {
                      id: val,
                      value: val,
                    };
                  }
                )}
                onSelect={(val) => setReligion(val)}
                placeholder={"Religion"}
              />

              <SelectCmp
                selectItems={[
                  { id: 1, value: "Audio" },
                  { id: 2, value: "Video" },
                ]}
                onSelect={(val) => setCommunicationPreference(val)}
                placeholder={"Communication preference"}
              />
            </div>

            <div className="pt-8 gap-x-4 grid grid-cols-2">
              <Button
                variant="outline"
                onClick={() => setShowFilterButtonOnly(!showFilterButtonOnly)}
              >
                Close
              </Button>
              <Button onClick={handleApplyFilter}>Apply</Button>
            </div>
          </div>
        </RenderIf>
      </div>

      <div className="bg-white w-full rounded-2xl py-4 px-3 md:p-6 grid content-start gap-y-4 md:gap-y-5 h-fit">
        <RenderIf condition={showGridView}>
          <h3 className="font-bold text-brand-1">Providers</h3>
        </RenderIf>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-between">
          <Searchbar onChange={onChangeHandler} placeholder="Search" />

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
        </div>

        <RenderIf condition={Object.keys(filters)?.length > 0}>
          <div className="flex items-start justify-between gap-x-3">
            <div className="flex flex-wrap gap-2">
              {Object.keys(filters)?.map((filter) => (
                <FilterTag
                  title={
                    filter === "service_offer_id" ? "Specific Service" : filter
                  }
                  value={
                    filter === "service_offer_id"
                      ? requestVariables["service-offering"]?.filter(
                          (val: { service_offer_id: string }) =>
                            val?.service_offer_id === filters[filter]
                        )[0]?.name
                      : filters[filter]
                  }
                  onClear={() => removeFilter(filter)}
                />
              ))}
            </div>

            <Button
              variant="link"
              className="underline underline-offset-1 text-button-primary text-xs"
              onClick={() => setFilters({})}
            >
              Clear all filters
            </Button>
          </div>
        </RenderIf>

        <RenderIf condition={!showGridView}>
          <TableCmp
            data={tableData ?? []}
            headers={PROVIDERS_TABLE_HEADERS}
            onClickRow={(row) => {
              if (row.datum.provider_data.user_type.toLowerCase() === "org") {
                router.push(
                  `/providers/organisation/${row.id}?type=${row.datum.provider_data.user_type}&service_type=${row.datum.provider_data.account_service_type}`
                );
              } else if (
                row.datum.provider_data.user_type.toLowerCase() === "provider"
              ) {
                router.push(
                  `/providers/individual/${row.id}?type=${row.datum.provider_data.user_type}&service_type=${row.datum.provider_data.account_service_type}`
                );
              }
            }}
            isLoading={isLoading}
            emptyStateTitleText="There are no providers yet"
          />

          <div
            className={cn(
              "grid md:hidden gap-4 md:gap-6",
              showFilterButtonOnly
                ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : "grid-cols-2 lg:grid-cols-3"
            )}
          >
            {data?.map((provider) => (
              <SingleProviderCard
                key={provider.provider_data?.user_id}
                {...provider}
              />
            ))}
          </div>
        </RenderIf>

        <RenderIf condition={showGridView}>
          <RenderIf condition={isLoading}>
            <div className="w-full h-full flex justify-center items-center">
              <Loader />
            </div>
          </RenderIf>

          <RenderIf condition={!isLoading}>
            <RenderIf condition={tableData?.length === 0}>
              <EmptyState
                title="Providers"
                subtitle="There are no providers yet"
                hasIcon
              />
            </RenderIf>

            <RenderIf condition={tableData?.length !== 0}>
              <div
                className={cn(
                  "grid gap-4 md:gap-6",
                  showFilterButtonOnly
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-2 lg:grid-cols-3"
                )}
              >
                {data?.map((provider) => (
                  <SingleProviderCard
                    key={provider?.provider_data?.user_id}
                    {...provider}
                  />
                ))}
              </div>
            </RenderIf>
          </RenderIf>
        </RenderIf>

        <RenderIf
          condition={!isLoading && tableData ? tableData.length > 0 : false}
        >
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
    </>
  );
};
