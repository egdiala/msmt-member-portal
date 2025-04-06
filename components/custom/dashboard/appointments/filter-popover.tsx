"use client";

import { useState } from "react";
import { IconListFilter } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterPopoverProps {
  onApplyFilters: (filters: any) => void;
}

export function FilterPopover({ onApplyFilters }: FilterPopoverProps) {
  const [dateFilter, setDateFilter] = useState("custom");
  const [statusFilter, setStatusFilter] = useState("upcoming");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApplyFilters = () => {
    onApplyFilters({
      date: dateFilter,
      status: statusFilter,
      fromDate: fromDate,
      toDate: toDate,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="w-fit">
        <Button variant="secondary" size="sm" className="rounded-full h-8 w-8 md:w-10">
          <IconListFilter className="h-4 w-4 stroke-brand-bkg-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] md:w-[400px] p-0 text-brand-1">
        <div className="p-4 pb-0">
          <h2 className="font-bold text-xl mb-1">Filter</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="grid gap-1 h-fit">
            <h3 className="text-xs font-medium uppercase text-brand-2">DATE</h3>
            <RadioGroup
              defaultValue={dateFilter}
              onValueChange={setDateFilter}
              className="gap-0"
            >
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today">Today</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month">This Month</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Time</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom">Custom Range</Label>
              </div>
            </RadioGroup>

            {dateFilter === "custom" && (
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="From"
                  className="bg-slate-50"
                  value={fromDate}
                  type="date"
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <Input
                  placeholder="To"
                  className="bg-slate-50"
                  value={toDate}
                   type="date"
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="grid gap-1 h-fit">
            <h3 className="text-xs font-medium uppercase text-brand-2">
              STATUS
            </h3>
            <RadioGroup
              defaultValue={statusFilter}
              onValueChange={setStatusFilter}
              className="gap-0"
            >
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="upcoming" id="upcoming" />
                <Label htmlFor="upcoming">Upcoming</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="completed" id="completed" />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2 px-2 py-2 md:py-3">
                <RadioGroupItem value="cancel" id="cancel" />
                <Label htmlFor="cancel">Cancel</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 pt-5 gap-4 ">
          <Button variant="secondary" className="py-2 px-14">
            Close
          </Button>
          <Button
            variant={"default"}
            className="py-2 px-14"
           
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
