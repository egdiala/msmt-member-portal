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
          "text-text-2 text-xs md:text-sm overflow-hidden whitespace-nowrap text-ellipsis",
          index === 0 ? "w-full" : "w-[18ch] md:w-full"
        )}
      >
        {title}
      </h4>
      <p className="text-xl md:text-2xl text-text-bg-1">{value}</p>

      <IconCalendarCheck2Dashboard
        className={cn(
          "absolute -top-1 md:top-2",
          index === 0 ? "-left-2.5 md:-left-3 lg:left-0" : "-left-4.5 lg:left-0"
        )}
      />
    </div>
  );
};
