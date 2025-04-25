import { VerifyBookingForm } from "@/components/custom/book-appointments/verify-booking-form";
import { Button } from "@/components/ui";
import { OrganizationCard } from "@/components/custom/dashboard/session/organization-card";

const VerifyBooking = () => {
  return (
    <main className="flex flex-col justify-center w-full h-full">
      <div className="mx-auto max-w-[650px] w-full flex flex-col gap-4">
        <div className="py-5 grid gap-1 text-center">
          <h1 className="text-text-1 text-lg md:text-2xl font-bold">Welcome</h1>
          <p className="text-sm font-normal text-text-2">
            {" "}
            Your organization has taken the first step in booking an appointment
            on your behalf. To complete the process, we will need you to select
            a provider of your choice and set your availability.
          </p>
        </div>
        <OrganizationCard
          organization={{ name: "Access Bank", type: "Financial Institution" }}
        />

        <VerifyBookingForm />

        <div className="flex justify-center mt-4">
          <Button type="submit" className="rounded-full">
            Verify Booking Code
          </Button>
        </div>
      </div>
    </main>
  );
};

export default VerifyBooking;
