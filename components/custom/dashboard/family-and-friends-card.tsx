"use client";

import Link from "next/link";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { CHART_CONFIG, COLORS } from "@/lib/constants";
import { FAMILY_AND_FRIENDS_DATA } from "@/lib/mock";

export const FamilyAndFriendsCard = () => {
  return (
    <div className="bg-white order-4 col-span-1 xl:col-span-3 content-start grid gap-y-7 w-full rounded-2xl px-4 pt-6 pb-10 xl:pb-6">
      <Link href="/family-and-friends">
        <Button className="w-fit gap-x-1">
          Family & Friends
          <IconExternalLink className="stroke-white" />
        </Button>
      </Link>

      <div className="w-full justify-center">
        <div className="flex flex-col justify-between items-center gap-y-7 w-full relative">
          <ChartContainer config={CHART_CONFIG} className="h-40 w-40">
            <PieChart width={400} height={900}>
              <Pie
                data={FAMILY_AND_FRIENDS_DATA}
                labelLine={false}
                innerRadius={65}
                outerRadius={70}
                dataKey="value"
                height={600}
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

          <div className="px-15 xl:px-5 flex justify-between w-full py-0">
            <div className="flex gap-x-2 items-center">
              <div className="border-r-2 h-9 border-actions-green"></div>

              <div>
                <p className="text-text-tertiary text-xs">Male</p>
                <p className="text-text-1 ">36</p>
              </div>
            </div>

            <div className="flex gap-x-2 items-center">
              <div className="border-r-2 h-9 border-status-danger"></div>

              <div>
                <p className="text-text-tertiary text-xs">Female</p>
                <p className="text-text-1">17</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
