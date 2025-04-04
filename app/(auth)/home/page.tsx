"use client";

import Link from "next/link";
import { IconTriangleAlert } from "@/components/icons";
import {
  BookAppointmentCard,
  DashboardStatCard,
  FamilyAndFriendsCard,
  UpcomingAppointmentCard,
  WalletBalanceCard,
  ProfileCard,
  FavouriteProvidersCard,
  NotificationsCard,
} from "@/components/custom";
import { Button } from "@/components/ui";
import { DASHBOARD_STATS_DATA } from "@/lib/mock";

const Dashboard = () => {
  return (
    <div className="w-full grid gap-y-4 md:gap-y-8">
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
                {`A complete profile helps you connect faster, build trust, and
                access all platform features—whether you're booking sessions,
                offering consultations, or managing clients. Update your details
                in just a few minutes!`}
              </p>
            </div>
          </div>

          <div className="ml-6 lg:ml-0">
            <Link href="/profile/complete-profile">
              <Button>Complete Profile</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {DASHBOARD_STATS_DATA.map((stat, index) => (
          <div
            key={stat.id}
            className={index === 0 ? "col-span-2 lg:col-span-1" : "col-span-1"}
          >
            <DashboardStatCard
              title={stat.title}
              value={stat.value}
              index={index}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-13 gap-5">
        <BookAppointmentCard />
        <UpcomingAppointmentCard />
        <WalletBalanceCard />
        <FamilyAndFriendsCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-12 gap-5">
        <ProfileCard />
        <FavouriteProvidersCard />
        <NotificationsCard />
      </div>
    </div>
  );
};

export default Dashboard;
