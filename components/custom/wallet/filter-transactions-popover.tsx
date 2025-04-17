"use client";

import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
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
  Input,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui";
import { RadioButton } from "@/components/shared";
import {
  TRANSACTIONS_FILTER_DATE_OPTIONS,
  TRANSACTIONS_FILTER_STATUS_OPTIONS,
  TRANSACTIONS_FILTER_TYPE_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const FilterContent = ({
  handleCloseFilter,
  applyFilter,
}: {
  handleCloseFilter: () => void;
  applyFilter: () => void;
}) => {
  const [selectedDateOption, setSelectedDateOption] = useState("all-time");
  const [selectedTypeOption, setSelectedTypeOption] = useState("");
  const [selectedStatusOption, setSelectedStatusOption] = useState("");

  return (
    <div className="p-6 grid gap-y-5 w-full">
      <h3 className="font-bold text-xl text-brand-1">Filter</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="grid gap-y-1">
          <h5 className="uppercase text-xs text-brand-2">Date</h5>

          <div className="grid gap-y-1">
            <RadioGroup
              defaultValue={selectedDateOption}
              onValueChange={(e) => setSelectedDateOption(e)}
            >
              {TRANSACTIONS_FILTER_DATE_OPTIONS.map((option) => (
                <RadioButton
                  key={option.id}
                  isActive={selectedDateOption === option.value}
                  option={option}
                />
              ))}
            </RadioGroup>
          </div>

          {selectedDateOption === "custom-range" && (
            <div className="grid gap-y-1">
              <Input placeholder="From" />
              <Input placeholder="To" />
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
      start_date: string;
      end_date: string;
      transaction_type: string;
      status: string;
    }>
  >;
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const today = startOfToday();
  const [dateFilters, setDateFilters] = useState([
    {
      label: "Today",
      name: "today",
      value: { start: today, end: today },
    },
    {
      label: "This Month",
      name: "current_month",
      value: {
        start: startOfMonth(
          parse(format(today, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
        ),
        end: endOfMonth(
          parse(format(today, "yyyy-MM-dd"), "yyyy-MM-dd", new Date())
        ),
      },
    },
    { label: "All Time", name: "all", value: { start: "", end: "" } },
    { label: "Custom", name: "custom", value: { start: "", end: "" } },
  ]);

  const [selected, setSelected] = useState(dateFilters[2]);

  //eslint-disable-next-line
  const [transactionTypeFilters, setTransactionTypeFilters] = useState("");
  //eslint-disable-next-line
  const [statusFilters, setStatusFilters] = useState("");

  //eslint-disable-next-line
  const setCustomDate = (dates: {
    start: Date | string;
    end: Date | string;
  }) => {
    const notCustom = dateFilters.filter(
      (item) => item.name !== "custom"
    ) as any;
    setDateFilters([
      ...notCustom,
      {
        label: "Custom",
        name: "custom",
        value: { start: dates.start, end: dates.end },
      },
    ]);
  };

  const applyFilter = (fn?: () => void) => {
    setFilters({
      start_date: selected.value.start
        ? format(selected.value.start, "yyyy-MM-dd")
        : "",
      end_date: selected.value.end
        ? format(selected.value.end, "yyyy-MM-dd")
        : "",
      transaction_type: transactionTypeFilters,
      status: statusFilters,
    });
    fn?.();
  };

  useEffect(() => {
    if (selected.name === "custom") {
      setSelected(
        dateFilters.filter((item) => item.name === "custom")?.at(0) as any
      );
    }
  }, [dateFilters, selected.name]);

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
              "w-144 relative border-none shadow-modal-shadow bg-white hidden md:flex p-0",
              isDeduction
                ? "right-13 xl:right-18"
                : "right-40 lg:right-48 xl:right-54"
            )}
          >
            <FilterContent
              handleCloseFilter={() => setOpenPopover(false)}
              applyFilter={applyFilter}
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
              />
            </DrawerPrimitive.Content>
          </DrawerPortal>
        </Drawer>
      </div>
    </Fragment>
  );
};
