"use client";

import { Download } from "lucide-react";
import { FilterPopover } from "./filter-popover";

interface AppointmentSearchProps {
  onFilter: (filters: any) => void;
  className?: string;
}

export function AppointmentSearch({
  onFilter,
  className,
}: AppointmentSearchProps) {
  return (
    <div className={className}>
      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-end">
        <div className="flex gap-2">
          <button className="h-9">
            {" "}
            <Download className="h-4 w-4" />
          </button>
          <FilterPopover onApplyFilters={onFilter} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden items-center justify-end gap-x-4">
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
