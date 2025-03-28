import { cn } from "@/lib/utils";
import { Label, RadioGroupItem } from "../ui";
import { RenderIf } from "./render-if";

interface IRadioButton {
  isActive: boolean;
  option: { id: string; value: string; name: string };
  hideLabel?: boolean;
}
export const RadioButton = ({
  isActive,
  option,
  hideLabel = false,
}: IRadioButton) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 p-1 md:px-2 md:py-2.5 cursor-pointer",
        isActive ? "bg-blue-400" : ""
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
          className="text-sm text-brand-1 capitalize font-normal cursor-pointer"
        >
          {option.name}
        </Label>
      </RenderIf>
    </div>
  );
};
