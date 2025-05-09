import { Badge } from "@/components/ui/badge";
import { getSessionStatus } from "@/lib/utils";
import { X } from "lucide-react";

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

  const formatFilterValue = (key: string, value: any) => {
    if (key === "status") {
      return getSessionStatus(Number(value));
    }
    return value;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={`flex mt-4 md:mt-5 flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-brand-2">Filters applied:</span>
      <div className="flex flex-wrap gap-2 ">
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;

          const displayKey =
            key === "fromDate"
              ? "From"
              : key === "toDate"
              ? "To"
              : capitalizeFirstLetter(key);

          const displayValue = formatFilterValue(key, value);

          return (
            <Badge
              key={key}
              variant="outline"
              className="flex items-center gap-1 py-1 px-2 bg-blue-400 border-none rounded-sm"
            >
              <span>
                {displayKey}:{" "}
                <span className="text-brand-accent-2">{displayValue}</span>
              </span>
              <button
                onClick={() => onClearFilter(key)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
                aria-label={`Remove ${key} filter`}
              >
                <X size={14} />
              </button>
            </Badge>
          );
        })}
      </div>

      {hasFilters && (
        <button
          onClick={onClearAll}
          className="text-sm text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
