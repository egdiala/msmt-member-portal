"use client";

import { IconTriangleAlert } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
  BookAppointmentCard,
  DashboardStatCard,
  FamilyAndFriendsCard,
  UpcomingAppointmentCard,
  WalletBalanceCard,
  ProfileCard,
  FavouriteProvidersCard,
  NotificationsCard,
} from "@/components/shared";
import { Button } from "@/components/ui";
import { COMPLETE_PROFILE } from "@/lib/routes";

const Dashboard = () => {
  const router = useRouter();

  const dashboardStats = [
    { id: 1, title: "Completed Appointments", value: 53 },
    { id: 2, title: "Upcoming Appointments", value: 53 },
    { id: 3, title: "Average Booking/Week", value: 3 },
  ];
  return (
    <div className="w-full grid gap-y-4 md:gap-y-8">
      <div className="border border-status-danger p-3 md:p-6 bg-status-light-red rounded-lg w-full">
        <div className="flex gap-3 items-start md:items-center flex-col md:flex-row ">
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

          <div className="ml-6 md:ml-0">
            <Button onClick={() => router.push(COMPLETE_PROFILE)}>
              Complete Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardStats.map((stat, index) => (
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

      <div className="flex flex-col justify-center xl:justify-normal md:flex-row gap-5 items-center flex-wrap 3xl:flex-nowrap">
        <BookAppointmentCard />
        <UpcomingAppointmentCard />
        <WalletBalanceCard />
        <FamilyAndFriendsCard />
      </div>

      <div className="flex flex-col justify-center xl:justify-normal md:flex-row gap-[21px] items-center flex-wrap 3xl:flex-nowrap">
        <ProfileCard />
        <FavouriteProvidersCard />
        <NotificationsCard />
      </div>
    </div>
  );
};

export default Dashboard;
