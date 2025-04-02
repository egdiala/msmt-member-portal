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
        "bg-input-field flex items-center min-w-full md:min-w-65 rounded-sm relative",
        className
      )}
    >
      <IconSearch className="stroke-text-tertiary absolute top-3 left-2 size-4" />

      <div className="w-full">
        <Input
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="w-full pl-8 border-none focus-visible:ring-offset-0 focus-visible:ring-0 pr-8 shadow-none h-10 py-1.5 placeholder:text-brand-3 text-text-tertiary text-sm"
        />

        <RenderIf condition={!!onClear && value !== ""}>
          <Button
            variant="ghost"
            className="cursor-pointer !p-0 absolute top-0.5 right-2"
            onClick={onClear}
          >
            <IconClose className="stroke-text-tertiary size-4" />
          </Button>
        </RenderIf>
      </div>
    </div>
  );
};
