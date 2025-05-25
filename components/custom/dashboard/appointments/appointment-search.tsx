"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { FilterPopover } from "./filter-popover";

interface AppointmentSearchProps {
  onFilter: (filters: any) => void;
  className?: string;
}

const BookSessionBtn = () => {
  return (
    <Button asChild>
      <Link href="/providers">Book Session</Link>
    </Button>
  );
};

export function AppointmentSearch({
  onFilter,
  className,
}: AppointmentSearchProps) {
  return (
    <div className={className}>
      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-end">
        <div className="flex gap-2">
          <FilterPopover onApplyFilters={onFilter} />
          <BookSessionBtn />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden items-center justify-end gap-x-4">
        <div className="flex items-center gap-x-4">
          <FilterPopover onApplyFilters={onFilter} />
          <BookSessionBtn />
        </div>
      </div>
    </div>
  );
}
