"use client";

import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { CHART_CONFIG, COLORS } from "@/lib/constants";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { FAMILY_AND_FRIENDS_DATA } from "@/lib/mock";

export const FamilyAndFriendsCard = () => {
  return (
    <div className="order-4 bg-white w-full md:w-[48%] 3xl:!w-[301px] grid gap-y-[29px] max-w-full md:max-w-[48%] 3xl:!max-w-[301px] h-[370px] rounded-2xl px-4 py-6">
      <Button className="bg-blue-400 text-button-primary font-semibold rounded-[100px] w-fit">
        Family & Friends
        <IconExternalLink className="stroke-button-primary" />
      </Button>

      <div className="flex flex-col items-center gap-y-[29px] px-[22.5px]">
        <div>
          <ChartContainer config={CHART_CONFIG}>
            <PieChart width={400} height={400}>
              <Pie
                data={FAMILY_AND_FRIENDS_DATA}
                // cx="10%"
                // cy="10%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {FAMILY_AND_FRIENDS_DATA.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="px-5 flex justify-between w-full">
          <div className="flex gap-x-2 items-center">
            <div className="border-r-2 h-[37px] border-actions-green"></div>

            <div>
              <p className="text-text-tertiary tracking-[-2%] text-xs">Male</p>
              <p className="text-text-1 leading-[150%]">36</p>
            </div>
          </div>

          <div className="flex gap-x-2 items-center">
            <div className="border-r-2 h-[37px] border-status-danger"></div>

            <div>
              <p className="text-text-tertiary tracking-[-2%] text-xs">
                Female
              </p>
              <p className="text-text-1 leading-[150%]">17</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
