import { cn } from "@/lib/utils";
import { Label, RadioGroupItem } from "../ui";
import { RenderIf } from "./render-if";

interface IRadioButton {
  isActive: boolean;
  option: { id: string; value: string; name: string };
  hideLabel?: boolean;
  className?: string;
}
export const RadioButton = ({
  isActive,
  option,
  hideLabel = false,
  className,
}: IRadioButton) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 p-1 md:px-2 md:py-2.5 cursor-pointer text-brand-1",
        isActive ? "bg-blue-400 text-button-primary" : "",
        className
      )}
    >
      <RadioGroupItem
        value={option.value}
        id={option.id}
        className="cursor-pointer"
      />

      <RenderIf condition={!hideLabel}>
        <Label
          htmlFor={option.id}
          className="text-sm capitalize font-normal cursor-pointer"
        >
          {option.name}
        </Label>
      </RenderIf>
    </div>
  );
};
