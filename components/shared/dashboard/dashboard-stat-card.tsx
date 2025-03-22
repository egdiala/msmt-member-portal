import { IconCalendarCheck2Dashboard } from "@/components/icons";
import { cn } from "@/lib/utils";

interface IDashboardStatCard {
  title: string;
  value: number;
  index: number;
}
export const DashboardStatCard = ({
  title,
  value,
  index,
}: IDashboardStatCard) => {
  return (
    <div className="relative flex flex-col justify-center items-center py-4 md:py-6 gap-y-1 text-center bg-white rounded-lg px-6 overflow-hidden">
      <h4
        className={cn(
          "text-text-2 text-xs md:text-sm overflow-hidden whitespace-nowrap text-ellipsis tracking-[-2%]",
          index === 0 ? "w-full" : "w-[18ch]"
        )}
      >
        {title}
      </h4>
      <p className="text-xl md:text-2xl text-text-bg-1">{value}</p>

      <IconCalendarCheck2Dashboard
        className={cn(
          "absolute top-[-4px] md:top-[8.55px]",
          index === 0
            ? "left-[-10px] md:left-[-12px] lg:left-0"
            : "left-[-18px] lg:left-0"
        )}
      />
    </div>
  );
};
