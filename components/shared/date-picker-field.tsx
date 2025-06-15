"use client";

import { format, getMonth, getYear, subYears } from "date-fns";
import DatePicker from "react-datepicker";
import { IconArrowDown, IconCalendar } from "@/components/icons";
import "react-datepicker/dist/react-datepicker.css";
import { FloatingInput } from "./floating-input";
import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";

interface DatePickerPopoverProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label: string;
  isDOB?: boolean;
  disableDatesBeforeToday?: boolean;
}

export const DatePickerField: React.FC<DatePickerPopoverProps> = ({
  value: selectedValue,
  onChange,
  label,
  isDOB,
  disableDatesBeforeToday,
}) => {
  const startYear = 1970;
  const endYear = isDOB ? getYear(new Date()) - 18 : getYear(new Date()); // current year

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <DatePicker
      onChange={(e) => {
        const date = e as Date;
        onChange(date);
      }}
      scrollableYearDropdown
      showMonthDropdown
      showYearDropdown
      minDate={disableDatesBeforeToday ? new Date() : new Date(1970)}
      maxDate={isDOB ? subYears(new Date(), 18) : new Date(endYear, 11, 31)}
      showPopperArrow={false}
      calendarClassName="msmt-datepicker"
      selected={
        selectedValue ??
        new Date(endYear, new Date().getMonth(), new Date().getDate())
      }
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => {
        console.log({ date });
        return (
          <div className="flex justify-between items-center my-1.5 mx-3 gap-x-4">
            <Button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              variant="ghost"
              className="rounded-full bg-blue-400 !px-2.5 !py-2.5 stroke-button-primary hover:stroke-white"
            >
              <IconArrowDown className="rotate-90" />
            </Button>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <Select
                value={getYear(date)?.toString()}
                onValueChange={(e) => {
                  changeYear(parseInt(e));
                }}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue
                    placeholder="Year"
                    className="placeholder:text-text-2"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {years?.reverse()?.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item?.toString()}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div onMouseDown={(e) => e.stopPropagation()}>
              <Select
                value={months[getMonth(date)]}
                onValueChange={(e) => {
                  changeMonth(months.indexOf(e));
                }}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue
                    placeholder="Month"
                    className="placeholder:text-text-2"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {months?.map((item, index) => (
                      <SelectItem
                        key={index}
                        value={item?.toString()}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              variant="ghost"
              className="rounded-full bg-blue-400 !px-2.5 !py-2.5 stroke-button-primary hover:stroke-white"
            >
              <IconArrowDown className="rotate-270" />
            </Button>
          </div>
        );
      }}
      customInput={
        <div className="relative">
          <FloatingInput
            value={
              selectedValue && selectedValue !== undefined
                ? format(selectedValue, "dd/MM/yyyy")
                : ""
            }
            label={label}
            className="pr-8"
            onChange={() => {
              console.log("");
            }}
          />
          <IconCalendar className="absolute right-3 bottom-2 -translate-y-1/2 h-5 w-5 stroke-brand-3" />
        </div>
      }
    />
  );
};
