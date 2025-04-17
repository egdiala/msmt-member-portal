import { RenderIf } from "./render-if";
import { IconEmptyState } from "../icons/icon-empty-state";

interface IEmptyState {
  hasIcon?: boolean;
  title: string;
  subtitle?: string;
}
export const EmptyState = ({ hasIcon, subtitle, title }: IEmptyState) => {
  return (
    <div className="flex flex-col gap-y-1 items-center justify-center py-4">
      <RenderIf condition={!!hasIcon}>
        <IconEmptyState />
      </RenderIf>

      <h3 className="text-brand-1 font-semibold text-sm">{title}</h3>

      <RenderIf condition={!!subtitle}>
        <p className="text-xs text-brand-3">{subtitle}</p>
      </RenderIf>
    </div>
  );
};
