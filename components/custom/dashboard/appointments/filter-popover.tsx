"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { date, z } from "zod";
import { format } from "date-fns";
import { IconListFilter } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePickerField } from "@/components/shared/date-picker-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RenderIf } from "@/components/shared";

const FilterSchema = z
  .object({
    date: z.string().optional(),
    status: z.string().optional(),
    fromDate: z.date().optional(),
    toDate: z.date().optional(),
  })
  .refine((data) => data.date || data.status || data.fromDate || data.toDate, {
    message: "Please select at least one filter.",
    path: ["date"],
  })
  .refine(
    (data) => !data.fromDate || !data.toDate || data.fromDate <= data.toDate,
    {
      message: "Start date must be before end date.",
      path: ["fromDate"],
    }
  );

type FilterFormValues = z.infer<typeof FilterSchema>;

interface FilterPopoverProps {
  onApplyFilters: (filters: FilterFormValues) => void;
}

export function FilterPopover({ onApplyFilters }: FilterPopoverProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(FilterSchema),
    mode: "onChange",
    defaultValues: {
      date: undefined,
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
    },
  });

  const { handleSubmit, formState, watch } = form;
  const { errors } = formState;
  const status = watch("status");
  console.log(errors, "ERTROR");

  const handleApplyFilters = handleSubmit((data) => {
    console.log(data, "DATA")
    onApplyFilters({...date, fromDate:format(data.fromDate, "yyyy-MM-dd"), toDate:format(data.toDate, "yyyy-MM-dd") });
  });

  return (
    <Popover>
      <PopoverTrigger asChild className="w-fit">
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full h-8 w-8 md:w-10"
        >
          <IconListFilter className="h-4 w-4 stroke-brand-bkg-1" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[calc(100vw-2.5rem)] md:w-[400px] transform origin-top-right p-0 text-brand-1"
        side="top"
        align="end"
        sideOffset={10}
      >
        <Form {...form}>
          <form onSubmit={handleApplyFilters}>
            <div className="p-4 pb-0">
              <h2 className="font-bold text-xl mb-1">Filter</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
              {/* DATE FILTER */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="grid gap-1 h-fit">
                    <h3 className="text-xs font-medium uppercase text-brand-2">
                      DATE
                    </h3>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="gap-0"
                      >
                        {["Today", "Month", "All", "Custom"].map((value) => (
                          <div
                            key={value}
                            className="flex items-center space-x-2 px-2 py-2 md:py-3"
                          >
                            <RadioGroupItem value={value} id={value} />
                            <Label htmlFor={value}>
                              {value.charAt(0).toUpperCase() + value.slice(1)}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />

                    <RenderIf condition={field.value === "Custom"}>
                      <div className="grid w-full mt-2 gap-y-2">
                        <FormField
                          control={form.control}
                          name="fromDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <DatePickerField
                                  label="From"
                                  value={
                                    status === "Custom"
                                      ? undefined
                                      : field.value
                                  }
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
                            <FormItem>
                              <FormControl>
                                <DatePickerField
                                  label="To"
                                  value={
                                    status === "Custom"
                                      ? undefined
                                      : field.value
                                  }
                                  onChange={field.onChange}
                                />
                              </FormControl>

                              <span className="text-xs text-status-danger">
                                {errors?.toDate?.message}
                              </span>
                            </FormItem>
                          )}
                        />
                      </div>
                    </RenderIf>
                  </FormItem>
                )}
              />

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
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="gap-0"
                      >
                        {["Upcoming", "Pending", "Completed", "Cancel"].map(
                          (value) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2 px-2 py-2 md:py-3"
                            >
                              <RadioGroupItem value={value} id={value} />
                              <Label htmlFor={value}>
                                {value.charAt(0).toUpperCase() + value.slice(1)}
                              </Label>
                            </div>
                          )
                        )}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end p-4 pt-5 gap-4">
              <Button variant="secondary" className="py-2 px-14" type="button">
                Close
              </Button>
              <Button variant="default" className="py-2 px-14" type="submit">
                Apply
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
