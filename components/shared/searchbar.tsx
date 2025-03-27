import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { RenderIf } from "./render-if";
import { Button, Input } from "../ui";
import { IconClose, IconSearch } from "../icons";

interface ISearchbar {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  onClear?: () => void;
  className?: string;
}

export const Searchbar = ({
  value,
  onChange,
  placeholder,
  onClear,
  className,
}: ISearchbar) => {
  return (
    <div
      className={cn(
        "bg-input-field flex items-center gap-x-2 min-w-20 md:min-w-65 rounded-sm relative",
        className
      )}
    >
      <IconSearch className="stroke-text-tertiary pl-2" />

      <div className="flex items-center w-full gap-x-1 pr-2">
        <Input
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="w-full border-none focus-visible:ring-offset-0 focus-visible:ring-0 px-0 shadow-none h-10 py-1.5 placeholder:text-brand-3 text-text-tertiary text-sm"
        />

        <RenderIf condition={!!onClear && value !== ""}>
          <Button
            variant="ghost"
            className="cursor-pointer !px-0"
            onClick={onClear}
          >
            <IconClose className="stroke-text-tertiary" />
          </Button>
        </RenderIf>
      </div>
    </div>
  );
};
