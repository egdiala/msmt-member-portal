"use client";

import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/hooks";

interface AppliedFiltersProps {
  filters: Record<string, any>;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function AppliedFilters({
  filters,
  onClearFilter,
  onClearAll,
  className,
}: AppliedFiltersProps) {
  const hasFilters = Object.keys(filters).length > 0;

  if (!hasFilters) return null;

  return (
    <div
      className={`flex justify-between md:justify-start gap-2 flex-wrap items-center text-sm ${className}`}
    >
      <div className="flex items-center gap-x-2">
        <span className="text-gray-500 mr-2">Filters applied:</span>
        <div className="flex items-center flex-wrap gap-x-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center px-2 py-1 h-7 text-brand-accent-2"
              >
                <span className="text-sm text-brand-2">
                  {capitalizeFirstLetter(key)}:
                </span>{" "}
                {capitalizeFirstLetter(value)}
                <button
                  className="ml-1 text-brand-1 font-semibold "
                  onClick={() => onClearFilter(key)}
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      </div>
      <button
        className="text-brand-1 underline hover:text-brand-accent-2 cursor-pointer text-sm"
        onClick={onClearAll}
      >
        Clear all filters
      </button>
    </div>
  );
}
