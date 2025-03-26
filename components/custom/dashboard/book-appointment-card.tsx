import { Button } from "@/components/ui";

export const BookAppointmentCard = () => {
  return (
    <div className="w-full p-2.5 flex items-end order-2 md:order-1 col-span-1 xl:col-span-3 bg-no-repeat bg-cover bg-[url(../components/assets/book-appointment.png)] rounded-2xl">
      <div className="mt-50 w-full bg-white opacity-89 py-5 px-6 grid gap-y-4.5 rounded-xl">
        <div className="text-center">
          <h3 className="text-2xl text-text-bg-1">200+</h3>
          <p className="text-xs text-text-2 rounded-xl">
            Providers available for you
          </p>
        </div>

        <Button>Book an Appointment</Button>
      </div>
    </div>
  );
};
