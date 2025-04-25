"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconList, IconList2 } from "@/components/icons";
import {
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Button } from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { EmptyState } from "@/components/shared/empty-state";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { useGetTableTotalPages } from "@/hooks/use-format-table-info";
import { FAVOURITE_PROVIDERS_TABLE_HEADERS } from "@/lib/constants";
import { useGetFavouriteProviders } from "@/services/hooks/queries/use-providers";
import {
  FetchedFavouriteProviders,
  FetchedServiceProvidersCountType,
} from "@/types/providers";
import { SingleProviderCard } from "./single-provider-card";

export const FavouriteProvidersTable = () => {
  const [showGridView, setShowGridView] = useState(true);

  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const { value, onChangeHandler } = useDebounce(400);

  const { data, isLoading } = useGetFavouriteProviders<
    FetchedFavouriteProviders[]
  >({ ...(value ? { q: value?.toString() } : {}) });

  const { data: favProvidersCount } =
    useGetFavouriteProviders<FetchedServiceProvidersCountType>({
      component: "count",
    });

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setPage);

  const tableData = data?.map((provider) => {
    return {
      id: provider?.provider_id,
      datum: provider,
      name: <p className="capitalize">{provider?.name}</p>,
      specialty: <p className="capitalize">{provider?.specialty ?? "N/A"}</p>,
      rating: provider?.rating,
    };
  });

  const router = useRouter();

  return (
    <div className="bg-white w-full rounded-2xl py-4 px-3 md:p-6 grid content-start gap-y-4 md:gap-y-5 h-fit">
      <RenderIf condition={showGridView}>
        <h3 className="font-bold text-brand-1">Favourite Providers</h3>
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
          headers={FAVOURITE_PROVIDERS_TABLE_HEADERS}
          onClickRow={(row) => {
            router.push(
              `/providers/individual/${row.id}?type=provider&service_type=provider`
            );
          }}
          isLoading={isLoading}
          emptyStateTitleText="There are no providers yet"
        />

        <div className="grid md:hidden gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          {data?.map((provider) => (
            <SingleProviderCard
              key={provider?.provider_id}
              provider_data={{
                name: provider?.name,
                avatar: provider?.avatar,
                user_type: "provider",
                account_type: "individual",
                account_service_type: "provider",
                user_id: provider?.provider_id,
                createdAt: "",
                specialty:
                  provider?.specialty || provider?.industry_name || "N/A",
                rating: provider?.rating?.toString(),
              }}
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
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
              {data?.map((provider) => (
                <SingleProviderCard
                  key={provider?.provider_id}
                  provider_data={{
                    name: provider?.name,
                    avatar: provider?.avatar,
                    user_type: "provider",
                    account_type: "individual",
                    account_service_type: "provider",
                    user_id: provider?.provider_id,
                    createdAt: "",
                    specialty:
                      provider?.specialty || provider?.industry_name || "N/A",
                    rating: provider?.rating?.toString(),
                  }}
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
            totalDataCount: favProvidersCount?.total ?? 0,
            itemsPerPage: itemsPerPage,
          })}
        />
      </RenderIf>
    </div>
  );
};
