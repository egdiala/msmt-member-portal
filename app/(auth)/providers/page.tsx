"use client";
import { useState } from "react";
import {
  IconCalendar,
  IconClose,
  IconList,
  IconList2,
  IconListFilter,
} from "@/components/icons";
import {
  BreadcrumbCmp,
  FloatingInput,
  PaginationCmp,
  RenderIf,
  Searchbar,
  SelectCmp,
  TableCmp,
} from "@/components/shared";
import { Button } from "@/components/ui";
import { SingleProviderCard } from "@/components/custom";
import { cn } from "@/lib/utils";
import { PROVIDERS_TABLE_HEADERS } from "@/lib/constants";
import { PROVIDERS_LIST } from "@/lib/mock";

const Providers = () => {
  const [showFilterButtonOnly, setShowFilterButtonOnly] = useState(true);
  const [showGridView, setShowGridView] = useState(true);

  const tableData = PROVIDERS_LIST.map((provider) => {
    return {
      id: provider.id,
      date_and_time: (
        <p className="text-brand-2">
          {provider.date} • {provider.time}
        </p>
      ),
      name: <p className="capitalize">{provider.name}</p>,
      specialty: <p className="capitalize">{provider.title}</p>,
      rating: provider.rating,
      type: <p className="capitalize">{provider.type}</p>,
      charge_from: <p className="capitalize">{provider.rate}</p>,
    };
  });

  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Providers" },
        ]}
      />

      <div className="flex md:gap-x-5">
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
                    onClick={() =>
                      setShowFilterButtonOnly(!showFilterButtonOnly)
                    }
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
            <Searchbar value="" onChange={() => {}} placeholder="Search" />

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
            <TableCmp data={tableData} headers={PROVIDERS_TABLE_HEADERS} />

            <div
              className={cn(
                "grid md:hidden gap-4 md:gap-6",
                showFilterButtonOnly
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-2 lg:grid-cols-3"
              )}
            >
              {PROVIDERS_LIST.map((provider) => (
                <SingleProviderCard key={provider.id} {...provider} />
              ))}
            </div>
          </RenderIf>

          <RenderIf condition={showGridView}>
            <div
              className={cn(
                "grid gap-4 md:gap-6",
                showFilterButtonOnly
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-2 lg:grid-cols-3"
              )}
            >
              {PROVIDERS_LIST.map((provider) => (
                <SingleProviderCard key={provider.id} {...provider} />
              ))}
            </div>
          </RenderIf>

          <PaginationCmp
            onInputPage={() => {}}
            currentPage={"1"}
            totalPages={"30"}
          />
        </div>
      </div>
    </div>
  );
};

export default Providers;
