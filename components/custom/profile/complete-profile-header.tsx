"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { useGetAppointments } from "@/services/hooks/queries/use-appointments";
import { IconTriangleAlert } from "@/components/icons";
import { RenderIf } from "@/components/shared";
import { hasCompletedBasicProfile } from "@/lib/utils";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { DashboardStatCard } from "../dashboard/dashboard-stat-card";

export const CompleteProfileHeader = () => {
  const { data: profileData, isPending } = useGetProfile();
  const { data: total, isLoading } = useGetAppointments({
    component: "count-status",
  });

  console.log("total", total);

  const DASHBOARD_STATS_DATA = [
    {
      id: 1,
      title: "Completed Appointments",
      value: (total as any)?.total_completed,
    },
    {
      id: 2,
      title: "Upcoming Appointments",
      value: (total as any)?.total_upcoming,
    },
    { id: 3, title: "Canceled Appointments", value: (total as any)?.total_cancel },
  ];

  return (
    <>
      <RenderIf
        condition={!hasCompletedBasicProfile(profileData!) && !isPending}
      >
        <div className="border border-status-danger p-3 md:p-6 bg-status-light-red rounded-lg w-full">
          <div className="flex gap-3 items-start lg:items-center flex-col lg:flex-row ">
            <div className="flex gap-2 md:gap-3">
              <div className="md:pt-1">
                <IconTriangleAlert className="stroke-status-danger size-4" />
              </div>

              <div className="grid gap-y-1">
                <h2 className="text-status-danger font-semibold text-sm md:text-lg">
                  Complete Your Profile for Full Access
                </h2>
                <p className="text-text-2 text-xs md:text-sm">
                  A complete profile helps you connect faster, build trust, and
                  access all platform features—whether you&apos;re booking
                  sessions, offering consultations, or managing clients. Update
                  your details in just a few minutes!
                </p>
              </div>
            </div>

            <div className="ml-6 lg:ml-0">
              <Button asChild>
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </RenderIf>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {DASHBOARD_STATS_DATA.map((stat, index) => (
          <div
            key={stat.id}
            className={index === 0 ? "col-span-2 lg:col-span-1" : "col-span-1"}
          >
            <DashboardStatCard
              isPending={isLoading}
              title={stat.title}
              value={stat.value}
              index={index}
            />
          </div>
        ))}
      </div>
    </>
  );
};
