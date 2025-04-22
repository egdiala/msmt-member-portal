"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconCalendar,
  IconClose,
  IconList,
  IconList2,
  IconListFilter,
} from "@/components/icons";
import {
  FloatingInput,
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
import {
  FetchedServiceProvidersCountType,
  FetchedServiceProvidersType,
} from "@/types/providers";
import { SingleProviderCard } from "./single-provider-card";

export const ProvidersTable = () => {
  const [showGridView, setShowGridView] = useState(true);

  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const { value, onChangeHandler } = useDebounce(400);

  const { data, isLoading } = useGetServiceProviders<
    FetchedServiceProvidersType[]
  >({ q: value?.toString() });

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
          {provider?.provider_data?.specialty ?? "N/A"}
        </p>
      ),
      rating:
        provider?.provider_data?.account_type === "payer"
          ? provider?.provider_data?.rating ?? "0"
          : "N/A",
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
              <div className="relative">
                <FloatingInput
                  label="Available date"
                  type="text"
                  className=" pr-10 w-full"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 stroke-brand-3 pointer-events-none">
                  <IconCalendar className="h-4 w-4" />
                </div>
              </div>
              <SelectCmp selectItems={[]} placeholder={"Provider type"} />
              <SelectCmp selectItems={[]} placeholder={"Service type"} />
              <SelectCmp selectItems={[]} placeholder={"Specific service"} />
              <SelectCmp selectItems={[]} placeholder={"Price range"} />
              <SelectCmp selectItems={[]} placeholder={"Gender"} />
              <SelectCmp selectItems={[]} placeholder={"Ratings"} />
              <SelectCmp
                selectItems={[]}
                placeholder={"Communication preference"}
              />
            </div>

            <div className="pt-8 gap-x-4 grid grid-cols-2">
              <Button variant="outline">Close</Button>
              <Button>Apply</Button>
            </div>
          </div>
        </RenderIf>
      </div>

      <div className="bg-white w-full rounded-2xl py-4 px-3 md:p-6 grid gap-y-4 md:gap-y-5">
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

        <RenderIf condition={!showGridView}>
          <TableCmp
            data={tableData ?? []}
            headers={PROVIDERS_TABLE_HEADERS}
            onClickRow={(row) => {
              if (row.datum.type.toLowerCase() === "organisation") {
                router.push(`/providers/organisation/${row.id}`);
              } else if (row.datum.type.toLowerCase() === "individual") {
                router.push(`/providers/individual/${row.id}`);
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

        <RenderIf condition={!isLoading && tableData!.length > 0}>
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
