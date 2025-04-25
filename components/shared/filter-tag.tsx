import { Button } from "../ui";
import { IconClose } from "../icons";

interface IFilterTag {
  title: string;
  value: string;
  onClear: () => void;
}

export const FilterTag = ({ title, value, onClear }: IFilterTag) => {
  return (
    <div className="bg-blue-400 flex items-center justify-between px-2 gap-x-2 rounded-sm">
      <p className="text-xs capitalize">
        {title}:
        <b className="text-button-primary font-normal capitalize pl-0.5">
          {value}
        </b>
      </p>

      <Button variant="ghost" className="!p-0 h-fit" onClick={onClear}>
        <IconClose className="stroke-brand-bkg-1" />
      </Button>
    </div>
  );
};
