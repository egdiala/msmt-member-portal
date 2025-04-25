"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { IconCalendar } from "@/components/icons";
import { FloatingInput } from "@/components/shared";

interface DatePickerPopoverProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  disabledDate?: any;
}

export const CalendarInput: React.FC<DatePickerPopoverProps> = ({
  value,
  onChange,
  label,
  disabledDate,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <FloatingInput
            label={label}
            readOnly
            value={value ? format(value, "PPP") : ""}
            className="pr-8 cursor-pointer"
            onClick={(e) => e.currentTarget.focus()}
          />
          <IconCalendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 stroke-brand-3 pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="w-auto p-0 z-50 overflow-visible"
        sideOffset={5}
        alignOffset={0}
        style={{ maxHeight: "none" }}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="border-none p-3"
          captionLayout="dropdown-buttons"
          disabled={disabledDate}
          fromYear={1920}
          toYear={new Date().getFullYear()}
          defaultMonth={new Date()}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
};
