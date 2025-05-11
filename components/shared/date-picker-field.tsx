import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { FloatingInput } from "./floating-input";
import { IconCalendar } from "@/components/icons";

interface DatePickerPopoverProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  isDOB?: boolean;
}

export const DatePickerField: React.FC<DatePickerPopoverProps> = ({
  value,
  onChange,
  label,
  isDOB,
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
        align="end"
        className="w-auto p-0 z-50 overflow-visible !bg-white"
        sideOffset={5}
        alignOffset={0}
        style={{ maxHeight: "none" }}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => {
            const today = new Date();
            return date > today;
          }}
          initialFocus
          className="border-none p-3"
          captionLayout="dropdown-buttons"
          fromYear={1920}
          toYear={
            isDOB ? new Date().getFullYear() - 18 : new Date().getFullYear()
          }
          defaultMonth={value ?? new Date()}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
};
