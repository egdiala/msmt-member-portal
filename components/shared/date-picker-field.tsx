import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { FloatingInput } from "./floating-input";
import { IconCalendar } from "@/components/icons";

interface DatePickerPopoverProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
}

export const DatePickerField: React.FC<DatePickerPopoverProps> = ({
  value,
  onChange,
  label,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
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
        </FormControl>
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
          disabled={(date) => {
            const today = new Date();
            const eighteenYearsAgo = new Date(
              today.getFullYear() - 18,
              today.getMonth(),
              today.getDate()
            );
            return date > eighteenYearsAgo || date > today;
          }}
          initialFocus
          className="border-none p-3"
          captionLayout="dropdown-buttons"
          fromYear={1920}
          toYear={new Date().getFullYear() - 18}
          defaultMonth={new Date(2000, 0)}
          showOutsideDays={false}
        />
      </PopoverContent>
    </Popover>
  );
};
