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
import type { SelectProps } from "@radix-ui/react-select";

interface SelectItemType {
  id: number;
  value: string;
  disabled?: boolean;
}

interface SelectCmpProps extends SelectProps {
  selectItems: SelectItemType[];
  placeholder: string;
  className?: string;
  onSelect?: (val: string) => void;
}

export function SelectCmp({
  selectItems,
  placeholder,
  className,
  onSelect,
  ...props
}: ISelectCmp) => {
  return (
    <Select {...props} onValueChange={(val) => onSelect && onSelect(val)}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue
          placeholder={placeholder}
          className="placeholder:text-text-2"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems?.map((item) => (
            <SelectItem
              key={item.id}
              value={item.value}
              disabled={item.disabled}
              className="capitalize"
            >
              {item.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
