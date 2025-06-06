"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { format } from "date-fns";
import { IconClose, IconListFilter } from "@/components/icons";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Drawer,
  DrawerPortal,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui";
import { SelectCmp } from "@/components/shared";
import { DatePickerField } from "@/components/shared/date-picker-field";
import {
  TRANSACTION_STATUS_ENUM,
  TRANSACTION_TYPE_ENUM,
  TRANSACTIONS_FILTER_STATUS_OPTIONS,
  TRANSACTIONS_FILTER_TYPE_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const FilterContent = ({
  handleCloseFilter,
  applyFilter,
  setSelectedTypeOption,
  setSelectedStatusOption,
  selectedStatusOption,
  selectedTypeOption,
  dateFilters,
  selected,
  setSelected,
  setCustomDate,
}: {
  handleCloseFilter: () => void;
  applyFilter: () => void;
  selectedTypeOption: string;
  setSelectedTypeOption: Dispatch<SetStateAction<string>>;
  selectedStatusOption: string;
  setSelectedStatusOption: Dispatch<SetStateAction<string>>;
  dateFilters: Record<string, any>;
  selected: any;
  setSelected: Dispatch<SetStateAction<any>>;
  setCustomDate: (val: any) => void;
}) => {
  return (
    <div className="p-6 flex flex-col justify-between gap-y-5 md:gap-y-1 w-full">
      <div className="grid gap-y-5 w-full">
        <h3 className="font-bold text-xl text-brand-1">Filter</h3>

        <div className="grid grid-cols-1 md:grid-cols-3  gap-8 content-start">
          <div className="grid gap-y-1 content-start">
            <h5 className="uppercase text-xs text-brand-2">Date</h5>

            <SelectCmp
              selectItems={dateFilters?.map((val: any, index: number) => {
                return {
                  id: index,
                  value: val?.name,
                };
              })}
              onSelect={(val) =>
                setSelected(
                  dateFilters?.filter(
                    (filter: { name: string }) => filter?.name === val
                  )[0]
                )
              }
              value={selected?.name}
              placeholder="date"
            />

            {selected?.name === "Custom" && (
              <div className="gap-y-2 grid md:hidden">
                <DatePickerField
                  value={selected?.value?.start}
                  onChange={(date: any) => {
                    setCustomDate({ start: date, end: selected?.value?.end });
                  }}
                  label={"From"}
                />

                <DatePickerField
                  value={selected?.value?.end}
                  onChange={(date: any) => {
                    setCustomDate({
                      start: selected?.value?.start,
                      end: date,
                    });
                  }}
                  label={"To"}
                />
              </div>
            )}
          </div>

          <div className="grid gap-y-1 content-start">
            <h5 className="uppercase text-xs text-brand-2">Type</h5>

            <SelectCmp
              selectItems={TRANSACTIONS_FILTER_TYPE_OPTIONS?.map(
                (val, index) => {
                  return {
                    id: index,
                    value: val?.name,
                  };
                }
              )}
              onSelect={(val) => setSelectedTypeOption(val)}
              value={selectedTypeOption === "" ? "All" : selectedTypeOption}
              placeholder="type"
            />
          </div>

          <div className="grid gap-y-1 content-start">
            <h5 className="uppercase text-xs text-brand-2">Status</h5>

            <SelectCmp
              selectItems={TRANSACTIONS_FILTER_STATUS_OPTIONS?.map(
                (val, index) => {
                  return {
                    id: index,
                    value: val?.name,
                  };
                }
              )}
              onSelect={(val) => setSelectedStatusOption(val)}
              value={selectedStatusOption === "" ? "All" : selectedStatusOption}
              placeholder="status"
            />
          </div>
        </div>

        {selected?.name === "Custom" && (
          <div className="gap-5 hidden md:flex w-full justify-between">
            <div className="w-full">
              <DatePickerField
                value={selected?.value?.start}
                onChange={(date: any) => {
                  setCustomDate({ start: date, end: selected?.value?.end });
                }}
                label={"From"}
              />
            </div>

            <div className="w-full">
              <DatePickerField
                value={selected?.value?.end}
                onChange={(date: any) => {
                  setCustomDate({
                    start: selected?.value?.start,
                    end: date,
                  });
                }}
                label={"To"}
              />
            </div>
          </div>
        )}
      </div>

      <div className="md:pt-8 flex justify-end items-center gap-x-4">
        <Button variant="secondary" onClick={handleCloseFilter}>
          Close
        </Button>
        <Button onClick={applyFilter}>Apply</Button>
      </div>
    </div>
  );
};

export const FilterTransactionsPopover = ({
  isDeduction = false,
  setFilters,
  selected,
  setSelected,
  transactionTypeFilter,
  setTransactionTypeFilter,
  statusFilter,
  setStatusFilter,
  dateFilters,
}: {
  isDeduction?: boolean;
  setFilters: Dispatch<
    SetStateAction<{
      start_date?: string;
      end_date?: string;
      transaction_type?: string;
      status?: string;
    }>
  >;
  selected: any;
  setSelected: Dispatch<SetStateAction<any>>;
  transactionTypeFilter: string;
  setTransactionTypeFilter: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  dateFilters: any;
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const setCustomDate = (dates: { start: string; end: string }) => {
    setSelected({
      id: 4,
      name: "Custom",
      value: { start: dates.start, end: dates.end, label: "custom-range" },
    });
  };

  const applyFilter = () => {
    const dateFilter =
      selected?.name !== "Custom"
        ? {
            start: dateFilters?.filter(
              (val: { name: string }) => val?.name === selected?.name
            )[0]?.value?.start,
            end: dateFilters?.filter(
              (val: { name: string }) => val?.name === selected?.name
            )[0]?.value?.end,
          }
        : { start: selected?.value?.start, end: selected?.value?.end };

    setFilters({
      ...(selected?.name !== "All Time"
        ? { start_date: format(dateFilter?.start, "yyyy-MM-dd") }
        : {}),
      ...(selected?.name !== "All Time"
        ? { end_date: format(dateFilter?.end, "yyyy-MM-dd") }
        : {}),
      ...(transactionTypeFilter !== ""
        ? {
            transaction_type:
              TRANSACTION_TYPE_ENUM[transactionTypeFilter?.toLowerCase()],
          }
        : {}),
      ...(statusFilter !== ""
        ? { status: TRANSACTION_STATUS_ENUM[statusFilter?.toLowerCase()] }
        : {}),
    });

    setOpenPopover(false);
  };

  return (
    <Fragment>
      <div className="hidden md:inline-flex">
        <Popover
          open={openPopover}
          onOpenChange={() => setOpenPopover(!openPopover)}
        >
          <PopoverTrigger asChild onClick={() => setOpenPopover(true)}>
            <Button
              variant="secondary"
              className="px-2 md:px-3 py-2 shadow-none"
            >
              <IconListFilter className="stroke-brand-btn-secondary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={10}
            className={cn(
              "w-144 h-fit overflow-visible pb-10 relative border-none shadow-modal-shadow bg-white hidden md:flex p-0",
              isDeduction
                ? "right-13 xl:right-18"
                : "right-40 lg:right-48 xl:right-54"
            )}
          >
            <FilterContent
              handleCloseFilter={() => setOpenPopover(false)}
              applyFilter={applyFilter}
              selectedStatusOption={statusFilter}
              setSelectedStatusOption={setStatusFilter}
              selectedTypeOption={transactionTypeFilter}
              setSelectedTypeOption={setTransactionTypeFilter}
              dateFilters={dateFilters}
              selected={selected}
              setSelected={setSelected}
              setCustomDate={setCustomDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:hidden">
        <Button
          variant="secondary"
          className="px-2 md:px-3 py-2 shadow-none"
          onClick={() => setOpenMobileDrawer(true)}
        >
          <IconListFilter className="stroke-brand-btn-secondary" />
        </Button>

        <Drawer
          open={openMobileDrawer}
          onOpenChange={() => setOpenMobileDrawer(!openMobileDrawer)}
        >
          <DrawerPortal>
            <DrawerPrimitive.Content
              className={cn(
                "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
                "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b",
                "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t",
                "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
                "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
                "min-h-full md:hidden"
              )}
            >
              <DrawerTitle className="hidden"></DrawerTitle>

              <DrawerClose
                onClick={() => setOpenMobileDrawer(false)}
                className="stroke-text-tertiary hover:stroke-white hover:bg-button-primary hover:rounded-full hover: p-2 absolute top-2 right-2"
              >
                <IconClose />
              </DrawerClose>

              <FilterContent
                handleCloseFilter={() => setOpenMobileDrawer(false)}
                applyFilter={() => {
                  applyFilter();
                  setOpenMobileDrawer(!openMobileDrawer);
                }}
                selectedStatusOption={statusFilter}
                setSelectedStatusOption={setStatusFilter}
                selectedTypeOption={transactionTypeFilter}
                setSelectedTypeOption={setTransactionTypeFilter}
                dateFilters={dateFilters}
                selected={selected}
                setSelected={setSelected}
                setCustomDate={setCustomDate}
              />
            </DrawerPrimitive.Content>
          </DrawerPortal>
        </Drawer>
      </div>
    </Fragment>
  );
};
