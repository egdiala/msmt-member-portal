"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconListFilter } from "@/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { DatePickerField } from "@/components/shared/date-picker-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RenderIf, SelectCmp } from "@/components/shared";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type FormattedFilterValues = {
  status?: string;
  fromDate?: string;
  toDate?: string;
};

const FilterSchema = z
  .object({
    dateFilter: z.string().optional(),
    status: z.string().optional(),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
  })
  // .refine((data) => data.status || data.fromDate || data.toDate, {
  //   message: "Please select at least one filter.",
  //   path: ["status"],
  // })
  .refine(
    (data) => !data.fromDate || !data.toDate || data.fromDate <= data.toDate,
    {
      message: "Start date must be before end date.",
      path: ["fromDate"],
    }
  );

type FilterFormValues = z.infer<typeof FilterSchema>;

interface FilterPopoverProps {
  onApplyFilters: (filters: FormattedFilterValues) => void;
}

export function FilterPopover({ onApplyFilters }: FilterPopoverProps) {
  const initialRender = useRef(true);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Default form values
  const defaultValues = {
    dateFilter: "All Time",
    status: "",
    fromDate: undefined,
    toDate: undefined,
  };

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(FilterSchema),
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit, formState, watch, setValue, reset } = form;
  const { errors } = formState;

  const dateSelection = watch("dateFilter");
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    switch (dateSelection) {
      case "Today":
        setValue("fromDate", startOfDay(new Date()));
        setValue("toDate", endOfDay(new Date()));
        break;
      case "This Month":
        setValue("fromDate", startOfMonth(new Date()));
        setValue("toDate", endOfMonth(new Date()));
        break;
      case "All Time":
        setValue("fromDate", undefined);
        setValue("toDate", undefined);
        break;
      case "Custom Range":
        break;
    }
  }, [dateSelection, setValue]);

  const handleApplyFilters = handleSubmit((data) => {
    // Don't include date fields if All Time is selected
    const formattedData: FormattedFilterValues = {
      status: data.status,
      fromDate: data.fromDate ? format(data.fromDate, "yyyy-MM-dd") : undefined,
      toDate: data.toDate ? format(data.toDate, "yyyy-MM-dd") : undefined,
    };

    // Remove undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(formattedData).filter(([, v]) => v !== undefined)
    );

    onApplyFilters(cleanedData);
    setOpen(false);
  });

  // useEffect(
  //   () => {
  //     if (open) {
  //       reset(defaultValues);
  //     }
  //   },
  //   // eslint-disable-next-line
  //   [open, reset]
  // );

  const handleClose = () => {
    reset(defaultValues);
    setOpen(false);
  };

  const dateFilters = ["Today", "This Month", "All Time", "Custom Range"];
  const statusFilters = [
    { value: "Upcoming", id: 1, index: "1" },
    { value: "Live", id: 2, index: "2" },
    { value: "Completed", id: 3, index: "3" },
    { value: "Cancel", id: 4, index: "4" },
    { value: "All", id: 5, index: "" },
  ];

  const DateSection = () => {
    return (
      <>
        <FormField
          control={form.control}
          name="fromDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DatePickerField
                  label="From"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>

              <span className="text-xs text-status-danger">
                {errors?.fromDate?.message}
              </span>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="toDate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DatePickerField
                  label="To"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>

              <span className="text-xs text-status-danger">
                {errors?.toDate?.message}
              </span>
            </FormItem>
          )}
        />
      </>
    );
  };

  const FilterForm = () => (
    <Form {...form}>
      <form onSubmit={handleApplyFilters}>
        <div className="p-4 pb-0">
          <h2 className="font-bold text-xl mb-1">Filter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
          {/* DATE FILTER */}
          <FormField
            control={form.control}
            name="dateFilter"
            render={({ field }) => (
              <FormItem className="grid gap-1 h-fit">
                <h3 className="text-xs font-medium uppercase text-brand-2">
                  DATE
                </h3>
                <FormControl>
                  <SelectCmp
                    selectItems={dateFilters?.map(
                      (val: string, index: number) => {
                        return {
                          id: index,
                          value: val,
                        };
                      }
                    )}
                    onSelect={(val) => field.onChange(val)}
                    value={field.value}
                    placeholder="Select date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <RenderIf condition={form.getValues("dateFilter") === "Custom Range"}>
            <div className="md:hidden flex flex-col items-center w-full gap-2">
              <DateSection />
            </div>
          </RenderIf>

          {/* STATUS FILTER */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="grid gap-1 h-fit">
                <h3 className="text-xs font-medium uppercase text-brand-2">
                  STATUS
                </h3>
                <FormControl>
                  <SelectCmp
                    selectItems={statusFilters}
                    onSelect={(val) =>
                      field.onChange(
                        statusFilters?.filter((inner) => inner.value === val)[0]
                          ?.index
                      )
                    }
                    value={
                      field.value === ""
                        ? "All"
                        : statusFilters?.filter(
                            (inner) => inner.index === field.value
                          )[0]?.value
                    }
                    placeholder="Select status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <RenderIf condition={form.getValues("dateFilter") === "Custom Range"}>
          <div className="hidden md:flex items-center w-full gap-2 px-4">
            <DateSection />
          </div>
        </RenderIf>

        <div className="flex items-center justify-end p-4 pt-5 gap-x-4">
          <Button
            variant="secondary"
            className="py-2 px-14"
            type="button"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button variant="default" className="py-2 px-14" type="submit">
            Apply
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-8 w-8 md:w-10"
            onClick={() => setOpen(true)}
          >
            <IconListFilter className="stroke-brand-btn-secondary" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <DrawerTitle className="sr-only">
            <h2 className="font-bold text-xl mb-1">Filter</h2>
          </DrawerTitle>
          <div className="absolute right-4 top-4">
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
          <FilterForm />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop view with Popover
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-fit">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full h-8 w-8 md:w-10"
        >
          <IconListFilter className="stroke-brand-btn-secondary" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[calc(100vw-2.5rem)] md:w-[400px] transform origin-top-right p-0 text-brand-1"
        side="top"
        align="end"
        sideOffset={10}
      >
        <FilterForm />
      </PopoverContent>
    </Popover>
  );
}
