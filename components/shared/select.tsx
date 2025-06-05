"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ISelectCmp {
  selectItems: { id: number; value: string }[];
  placeholder: string;
  className?: string;
  lowercase?: boolean;
  value?: string;
  onSelect?: (val: string) => void;
}
export const SelectCmp = ({
  selectItems,
  placeholder,
  className,
  lowercase = true,
  onSelect,
  value,
  ...props
}: ISelectCmp) => {
  return (
    <Select
      {...props}
      value={value}
      onValueChange={(val) => onSelect && onSelect(val)}
    >
      <SelectTrigger className={cn("w-full cursor-pointer", className)}>
        <SelectValue
          placeholder={`Select ${placeholder}`}
          className="placeholder:text-grey-300"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems?.map((item) => (
            <SelectItem
              key={item.id}
              value={item.value}
              className={cn(lowercase && "capitalize")}
            >
              {item.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
