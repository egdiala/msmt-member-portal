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
}
export const SelectCmp = ({
  selectItems,
  placeholder,
  className,
}: ISelectCmp) => {
  return (
    <Select>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems.map((item) => (
            <SelectItem key={item.id} value={item.value} className="capitalize">
              {item.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
