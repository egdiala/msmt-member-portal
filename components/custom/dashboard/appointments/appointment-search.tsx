"use client";

import { Search, Download } from "lucide-react";
import { Searchbar } from "@/components/shared";
import { FilterPopover } from "./filter-popover";

interface AppointmentSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
  className?: string;
}

export function AppointmentSearch({
  onSearch,
  onFilter,
  className,
}: AppointmentSearchProps) {
  return (
    <div className={className}>
      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between">
        <div className="relative w-[300px]">
          <Searchbar
            value=""
            placeholder="Search"
            className="h-10 placeholder:text-sm text-sm placeholder:font-normal"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="h-9">
            {" "}
            <Download className="h-4 w-4" />
          </button>
          <FilterPopover onApplyFilters={onFilter} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden items-center justify-between gap-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-brand-3" />
          <Searchbar
            placeholder="Search"
            value=""
            className=" h-10 placeholder:text-sm text-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-x-4">
          <button className="h-8 md:w-8 p-2 grid place-content-center">
            <Download className="h-4 w-4 text-brand-bkg-1" />
          </button>
          <FilterPopover onApplyFilters={onFilter} />
        </div>
      </div>
    </div>
  );
}
