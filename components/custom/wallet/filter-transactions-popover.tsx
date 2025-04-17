"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import {
  endOfMonth,
  format,
  parse,
  startOfMonth,
  startOfToday,
} from "date-fns";
import { IconClose, IconListFilter } from "@/components/icons";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Drawer,
  DrawerPortal,
  RadioGroup,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui";
import { RadioButton } from "@/components/shared";
import {
  TRANSACTION_STATUS_ENUM,
  TRANSACTION_TYPE_ENUM,
  TRANSACTIONS_FILTER_STATUS_OPTIONS,
  TRANSACTIONS_FILTER_TYPE_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CalendarInput } from "./calendar-input";

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
    <div className="p-6 grid gap-y-5 w-full">
      <h3 className="font-bold text-xl text-brand-1">Filter</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="grid gap-y-1">
          <h5 className="uppercase text-xs text-brand-2">Date</h5>

          <div className="grid gap-y-1">
            <RadioGroup
              defaultValue={selected.value}
              onValueChange={(e) => setSelected({ value: e })}
            >
              {dateFilters?.map((option: any) => {
                return (
                  <RadioButton
                    key={option.id}
                    isActive={selected.value.label === option.value.label}
                    option={option}
                  />
                );
              })}
            </RadioGroup>
          </div>

          {selected.value.label === "custom-range" && (
            <div className="grid gap-y-1">
              <CalendarInput
                value={selected.value.start}
                onChange={(e) => {
                  setCustomDate({ start: e, end: selected.value.end });
                }}
                label="From"
              />

              <CalendarInput
                value={selected.value.end}
                onChange={(e) => {
                  setCustomDate({
                    start: selected.value.start,
                    end: e,
                  });
                }}
                label="To"
              />
            </div>
          )}
        </div>

        <div className="grid gap-y-1 content-start">
          <h5 className="uppercase text-xs text-brand-2">Type</h5>

          <div className="grid gap-y-1">
            <RadioGroup
              defaultValue={selectedTypeOption}
              onValueChange={(e) => setSelectedTypeOption(e)}
            >
              {TRANSACTIONS_FILTER_TYPE_OPTIONS.map((type) => (
                <RadioButton
                  key={type.id}
                  isActive={selectedTypeOption === type.value}
                  option={type}
                />
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="grid gap-y-1 content-start">
          <h5 className="uppercase text-xs text-brand-2">Status</h5>

          <div className="grid gap-y-1">
            <RadioGroup
              defaultValue={selectedStatusOption}
              onValueChange={(e) => setSelectedStatusOption(e)}
            >
              {TRANSACTIONS_FILTER_STATUS_OPTIONS.map((status) => (
                <RadioButton
                  key={status.id}
                  isActive={selectedStatusOption === status.value}
                  option={status}
                />
              ))}
            </RadioGroup>
          </div>
        </div>
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
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const today = startOfToday();
  //eslint-disable-next-line
  const [dateFilters, _] = useState([
    {
      id: 1,
      name: "Today",
      value: { start: today, end: today, label: "today" },
    },
    {
      id: 2,
      name: "This Month",
      value: {
        start: startOfMonth(
          parse(format(today, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
        ),
        end: endOfMonth(
          parse(format(today, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
        ),
        label: "this-month",
      },
    },
    {
      id: 3,
      name: "All Time",
      value: { start: "", end: "", label: "all-time" },
    },
    {
      id: 4,
      name: "Custom",
      value: { start: "", end: "", label: "custom-range" },
    },
  ]);

  const [selected, setSelected] = useState(dateFilters[2]);

  const [transactionTypeFilter, setTransactionTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const setCustomDate = (dates: { start: string; end: string }) => {
    setSelected({
      id: 4,
      name: "Custom",
      value: { start: dates.start, end: dates.end, label: "custom-range" },
    });
  };

  const applyFilter = () => {
    setFilters({
      ...(selected.value.start
        ? { start_date: format(selected.value.start, "yyyy-MM-dd") }
        : {}),
      ...(selected.value.end
        ? { end_date: format(selected.value.end, "yyyy-MM-dd") }
        : {}),
      ...(transactionTypeFilter
        ? { transaction_type: TRANSACTION_TYPE_ENUM[transactionTypeFilter] }
        : {}),
      ...(statusFilter
        ? { status: TRANSACTION_STATUS_ENUM[statusFilter] }
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
              "w-144 h-100 overflow-y-scroll pb-10 relative border-none shadow-modal-shadow bg-white hidden md:flex p-0",
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
            </DrawerPrimitive.Content>
          </DrawerPortal>
        </Drawer>
      </div>
    </Fragment>
  );
};
