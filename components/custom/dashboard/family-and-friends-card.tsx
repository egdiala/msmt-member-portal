"use client";

import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { CHART_CONFIG, COLORS } from "@/lib/constants";
import { FAMILY_AND_FRIENDS_DATA } from "@/lib/mock";
import { FAMILY_AND_FRIENDS } from "@/lib/routes";

export const FamilyAndFriendsCard = () => {
  return (
    <div className="bg-white order-4 col-span-1 xl:col-span-3 content-start grid gap-y-[29px] w-full h-[370px] rounded-2xl px-4 py-6">
      <Link href={FAMILY_AND_FRIENDS}>
        <Button className="rounded-[100px] w-fit gap-x-1">
          Family & Friends
          <IconExternalLink className="stroke-white" />
        </Button>
      </Link>

      <div className="w-full justify-center items-center">
        <div className="flex flex-col items-center gap-y-[29px] h-[238.76px] w-full xl:w-[76%] 3xl:!w-[88%] px-[5%] xl:px-[0%]">
          <ChartContainer
            config={CHART_CONFIG}
            className="w-[70%] h-[70%] container"
          >
            <PieChart width={400} height={600}>
              <Pie
                data={FAMILY_AND_FRIENDS_DATA}
                labelLine={false}
                innerRadius={75}
                outerRadius={80}
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

          <div className="px-5 flex justify-between w-full py-0">
            <div className="flex gap-x-2 items-center">
              <div className="border-r-2 h-[37px] border-actions-green"></div>

              <div>
                <p className="text-text-tertiary tracking-[-2%] text-xs">
                  Male
                </p>
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
    </div>
  );
};
