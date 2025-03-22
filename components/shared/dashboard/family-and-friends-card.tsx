"use client";

import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

export const FamilyAndFriendsCard = () => {
  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const COLORS = ["#DD2418", "#0AA571"];

  const chartConfig = {
    desktop: {
      label: "Male",
      color: "#DD2418",
    },
    mobile: {
      label: "Femal",
      color: "#0AA571",
    },
  } satisfies ChartConfig;

  return (
    <div className="bg-white w-full md:w-[301px] grid gap-y-[29px] max-w-full md:max-w-[301px] h-[370px] rounded-2xl px-4 py-6">
      <Button className="bg-blue-400 text-button-primary font-semibold rounded-[100px] w-fit">
        Family & Friends
        <IconExternalLink className="stroke-button-primary" />
      </Button>

      <div className="flex flex-col items-center gap-y-[29px] px-[22.5px]">
        <div>
          <ChartContainer config={chartConfig}>
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                // cx="10%"
                // cy="10%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
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
