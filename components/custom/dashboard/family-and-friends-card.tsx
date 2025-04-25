"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Cell, Label, Pie, PieChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { BLUR_VARIANTS, CHART_CONFIG, COLORS } from "@/lib/constants";
import { useGetFamilyAndFriends } from "@/services/hooks/queries/use-family-and-friends";
import {
  FetchedFamilyAndFriendCountType,
  FetchedFamilyAndFriendStats,
} from "@/types/family-and-friends";

export const FamilyAndFriendsCard = () => {
  const { data, isLoading } =
    useGetFamilyAndFriends<FetchedFamilyAndFriendStats>({
      component: "count-relationship",
    });

  const { data: count, isLoading: countLoading } =
    useGetFamilyAndFriends<FetchedFamilyAndFriendCountType>({
      component: "count",
    });

  const familyAndFriendsChartData = [
    { name: "Group A", value: data?.total_friend ?? 0 },
    { name: "Group B", value: data?.total_family ?? 0 },
  ];

  const familyAndFriendsData = [
    { id: 1, title: "Total", value: count?.total ?? 0 },
    { id: 2, title: "Family", value: data?.total_family ?? 0 },
    { id: 3, title: "Friends", value: data?.total_friend ?? 0 },
  ];

  return (
    <AnimatePresence mode="popLayout">
      {(isLoading || countLoading) ? (
        <motion.div
          key="ff-card-skeleton-loader"
          layoutId="ff-card"
          className="order-3 col-span-1 xl:col-span-3"
          variants={BLUR_VARIANTS}
          animate="enter"
          exit="exit"
        >
          <Skeleton className="h-full w-full rounded-2xl" />
        </motion.div>
      ) : (
        <motion.div
          key="ff-card"
          layoutId="ff-card"
          className="bg-white order-4 col-span-1 xl:col-span-3 content-start flex flex-col-reverse md:flex-col gap-y-4 md:gap-y-7 w-full rounded-2xl px-4 pt-4 md:pt-6 pb-4 md:pb-10 xl:pb-6"
          variants={BLUR_VARIANTS}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          <Button
            asChild
            variant="secondary"
            className="text-button-primary gap-x-1 w-fit"
          >
            <Link href="/family-and-friends">
              Family & Friends
              <IconExternalLink className="stroke-button-primary" />
            </Link>
          </Button>

          <div className="w-full hidden md:inline">
            <div className="flex flex-col justify-between items-center gap-y-7 w-full relative">
              <div className="flex w-full justify-center items-center relative">
                <ChartContainer config={CHART_CONFIG} className="h-40 w-40">
                  <PieChart width={400} height={900}>
                    <Pie
                      data={familyAndFriendsChartData}
                      labelLine={false}
                      innerRadius={65}
                      outerRadius={70}
                      dataKey="value"
                      height={600}
                    >
                      {familyAndFriendsChartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="grid"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) - 10}
                                    className="text-xs fill-brand-3"
                                  >
                                    Total
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 14}
                                    className="fill-brand-1 text-xl"
                                  >
                                    {(count?.total ?? 0).toLocaleString()}
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                    </Pie>
                  </PieChart>
                </ChartContainer>

                {/* <div className="absolute w-full flex flex-col justify-center items-center">
                  <p className="text-xs text-brand-3">Total</p>
                  <h4 className="text-xl text-brand-1">{count?.total ?? 0}</h4>
                </div> */}
              </div>

              <div className="px-15 xl:px-5 flex justify-between w-full py-0">
                <div className="flex gap-x-2 items-center">
                  <div className="border-r-2 h-9 border-actions-green"></div>

                  <div>
                    <p className="text-text-tertiary text-xs">Family</p>
                    <p className="text-text-1 ">{data?.total_family ?? 0}</p>
                  </div>
                </div>

                <div className="flex gap-x-2 items-center">
                  <div className="border-r-2 h-9 border-status-danger"></div>

                  <div>
                    <p className="text-text-tertiary text-xs">Friend</p>
                    <p className="text-text-1">{data?.total_friend ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden flex justify-between items-center">
            {familyAndFriendsData?.map((val) => (
              <div key={val.id} className="grid gap-y-0.5">
                <p className="text-brand-3 text-xs">{val.title}</p>
                <h3 className="text-xl text-brand-1">{val.value}</h3>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
