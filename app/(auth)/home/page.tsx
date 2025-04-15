import {
  FamilyAndFriendsCard,
  UpcomingAppointmentCard,
  WalletBalanceCard,
  ProfileCard,
  FavouriteProvidersCard,
  NotificationsCard,
  BookAppointmentCard,
  CompleteProfileHeader,
} from "@/components/custom";

const Dashboard = () => {
  return (
    <div className="w-full grid gap-y-4 md:gap-y-8">
      <CompleteProfileHeader />

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
