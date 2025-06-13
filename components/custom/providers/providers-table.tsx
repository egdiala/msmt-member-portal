"use client";

import { useState } from "react";
import Cookies from "js-cookie";
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
import { DatePickerField } from "@/components/shared/date-picker-field";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { useGetTableTotalPages } from "@/hooks/use-format-table-info";
import { cn } from "@/lib/utils";
import {
  PROVIDER_FILTER_KEY_MATCH,
  PROVIDERS_TABLE_HEADERS,
} from "@/lib/constants";
import { useGetServiceProviders } from "@/services/hooks/queries/use-providers";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import {
  FetchedServiceProvidersCountType,
  FetchedServiceProvidersType,
} from "@/types/providers";
import { SingleProviderCard } from "./single-provider-card";
import { FilterProvidersTable } from "./filter-providers-table";

export const ProvidersTable = () => {
  const [showGridView, setShowGridView] = useState(true);
  const isLoggedIn = !!Cookies.get("authToken");

  const loggedInUser = JSON.parse(localStorage.getItem("user") as string);

  const { data: requestVariables } = useMultipleRequestVariables([
    "service-offering",
    "preferred-lan",
    "religion-list",
    "booking-prices",
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
      ...(apptDate
        ? { time_zone: new Date().getTimezoneOffset()?.toString() }
        : {}),
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
      ...(priceRange
        ? {
            amount: requestVariables["booking-prices"]?.filter(
              (val: { name: string }) => val?.name === priceRange
            )[0]?.value,
          }
        : {}),
      ...(gender ? { gender: gender?.toLowerCase() } : {}),
      ...(language ? { language: language?.toLowerCase() } : {}),
      ...(religion ? { religion: religion?.toLowerCase() } : {}),
      ...(communicationPreference
        ? { comm_mode: communicationPreference?.toLowerCase() }
        : {}),
    });
  };

  const handleClearAllFilters = () => {
    setApptDate("");
    setProviderType("");
    setSpecificService("");
    setPriceRange("");
    setGender("");
    setLanguage("");
    setReligion("");
    setCommunicationPreference("");
  };

  const removeFilter = (filterToRemove: string) => {
    const setFilterValues: Record<string, any> = {
      appt_date: setApptDate,
      time_zone: setApptDate,
      user_type: setProviderType,
      service_offer_id: setSpecificService,
      amount: setPriceRange,
      gender: setGender,
      language: setLanguage,
      religion: setReligion,
      comm_mode: setCommunicationPreference,
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

  const itemsPerPage = 12;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const { value, onChangeHandler } = useDebounce(400);

  const { data, isLoading } = useGetServiceProviders<
    FetchedServiceProvidersType[]
  >({
    ...(value ? { q: value?.toString() } : {}),
    ...filters,
    item_per_page: itemsPerPage?.toString(),
    page: page?.toString(),
    residence_country: loggedInUser?.residence_country,
  });

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
      residence_country: loggedInUser?.residence_country,
      ...filters,
    });

  const tableData = data?.map((provider) => {
    return {
      id: provider?.provider_data?.user_id,
      datum: provider,
      name: <p className="capitalize">{provider?.provider_data?.name}</p>,
      specialty: (
        <p className="capitalize">
          {provider?.provider_data?.specialty ||
            provider?.provider_data?.industry_name ||
            "N/A"}
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
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const FilterContent = ({
    handleApplyMobile,
  }: {
    handleApplyMobile?: () => void;
  }) => {
    return (
      <>
        <div className="grid gap-y-4 w-full">
          <DatePickerField
            value={apptDate === "" ? undefined : new Date(apptDate)}
            onChange={(date: any) => {
              setApptDate(format(date, "yyy-MM-dd"));
            }}
            label={"Available date"}
            disableDatesBeforeToday
          />

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">Provider type</h3>
            <SelectCmp
              selectItems={[
                { id: 1, value: "Provider" },
                { id: 2, value: "Organization" },
              ]}
              value={providerType}
              onSelect={(val) => setProviderType(val)}
              placeholder={"Provider type"}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">
              Specific Service
            </h3>
            <SelectCmp
              selectItems={requestVariables["service-offering"]?.map(
                (val: { service_offer_id: string; name: string }) => {
                  return { id: val?.service_offer_id, value: val?.name };
                }
              )}
              value={specificService}
              onSelect={(val) => setSpecificService(val)}
              placeholder={"Specific service"}
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">Price range</h3>
            <SelectCmp
              selectItems={requestVariables["booking-prices"]?.map(
                (val: { name: string }, index: number) => {
                  return {
                    id: index,
                    value: val?.name,
                  };
                }
              )}
              value={priceRange}
              onSelect={(val) => setPriceRange(val)}
              placeholder={"Price range"}
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">Gender</h3>
            <SelectCmp
              selectItems={[
                { id: 1, value: "Male" },
                { id: 2, value: "Female" },
              ]}
              value={gender}
              onSelect={(val) => setGender(val)}
              placeholder={"Gender"}
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">
              Preferred Language
            </h3>
            <SelectCmp
              selectItems={requestVariables["preferred-lan"]?.map(
                (val: string) => {
                  return {
                    id: val,
                    value: val,
                  };
                }
              )}
              value={language}
              onSelect={(val) => setLanguage(val)}
              placeholder={"Language"}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">Religion</h3>
            <SelectCmp
              selectItems={requestVariables["religion-list"]?.map(
                (val: string) => {
                  return {
                    id: val,
                    value: val,
                  };
                }
              )}
              value={religion}
              onSelect={(val) => setReligion(val)}
              placeholder={"Religion"}
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-brand-2">
              Communication Preference
            </h3>
            <SelectCmp
              selectItems={[
                { id: 1, value: "Audio" },
                { id: 2, value: "Video" },
              ]}
              value={communicationPreference}
              onSelect={(val) => setCommunicationPreference(val)}
              placeholder={"Communication preference"}
            />
          </div>
        </div>

        <div className="pt-8 gap-x-4 grid grid-cols-2">
          <Button
            variant="outline"
            onClick={() => setShowFilterButtonOnly(!showFilterButtonOnly)}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              handleApplyFilter();

              if (handleApplyMobile) {
                handleApplyMobile();
              }
            }}
          >
            Apply
          </Button>
        </div>
      </>
    );
  };

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

            <FilterContent />
          </div>
        </RenderIf>
      </div>

      <div className="bg-white w-full rounded-2xl py-4 px-3 md:p-6 grid content-start gap-y-4 md:gap-y-5 h-fit">
        <RenderIf condition={showGridView}>
          <h3 className="font-bold text-brand-1">Providers</h3>
        </RenderIf>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-between">
          <Searchbar onChange={onChangeHandler} placeholder="Search" />

          <FilterProvidersTable
            openMobileDrawer={openMobileDrawer}
            setOpenMobileDrawer={setOpenMobileDrawer}
          >
            <div className="p-3 grid gap-y-4">
              <h4 className="font-semibold">Filter</h4>
              <FilterContent
                handleApplyMobile={() => setOpenMobileDrawer(false)}
              />
            </div>
          </FilterProvidersTable>

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
                      : filter === "amount"
                      ? requestVariables["booking-prices"]?.filter(
                          (val: { value: string }) =>
                            val?.value === filters[filter]
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
            onClickRow={(row) => {
              if (isLoggedIn) {
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
              } else {
                if (row.datum.provider_data.user_type.toLowerCase() === "org") {
                  router.push(
                    `/complete-booking/providers/organisation/${row.id}?type=${row.datum.provider_data.user_type}&service_type=${row.datum.provider_data.account_service_type}`
                  );
                } else if (
                  row.datum.provider_data.user_type.toLowerCase() === "provider"
                ) {
                  router.push(
                    `/complete-booking/providers/individual/${row.id}?type=${row.datum.provider_data.user_type}&service_type=${row.datum.provider_data.account_service_type}`
                  );
                }
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
            <div className="w-full h-full min-h-[300px] flex justify-center items-center">
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
