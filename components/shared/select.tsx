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
import type { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form";

interface SelectItemType {
  id: number;
  value: string;
  disabled?: boolean;
}

interface SelectCmpProps<T extends FieldValues> {
  field: ControllerRenderProps<T, FieldPath<T>>;
  selectItems: SelectItemType[];
  placeholder: string;
  className?: string;
  disabled?: boolean;
}

export function SelectCmp<T extends FieldValues>({
  field,
  selectItems,
  placeholder,
  className,
  disabled = false,
}: SelectCmpProps<T>) {
  return (
    <Select
      value={field.value}
      onValueChange={field.onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} className="placeholder:text-text-2" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems.map((item) => (
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