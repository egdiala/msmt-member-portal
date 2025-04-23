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
  onSelect?: (val: string) => void;
}
export const SelectCmp = ({
  selectItems,
  placeholder,
  className,
  onSelect,
  ...props
}: ISelectCmp) => {
  return (
    <Select {...props} onValueChange={(val) => onSelect && onSelect(val)}>
      <SelectTrigger className={cn("w-full cursor-pointer", className)}>
        <SelectValue
          placeholder={placeholder}
          className="placeholder:text-text-2"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems?.map((item) => (
            <SelectItem key={item.id} value={item.value} className="capitalize">
              {item.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
