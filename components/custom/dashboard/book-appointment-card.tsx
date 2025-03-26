import { Button } from "@/components/ui";

export const BookAppointmentCard = () => {
  return (
    <div className="relative order-2 md:order-1 col-span-1 xl:col-span-3  h-[370px] bg-no-repeat bg-cover bg-[url(../components/assets/book-appointment.png)] rounded-2xl">
      <div className="absolute bottom-2 w-[calc(100%-16px)] mx-2 bg-white opacity-89 py-5 px-6 grid gap-y-[17px] rounded-xl">
        <div className="text-center">
          <h3 className="text-2xl text-text-bg-1">200+</h3>
          <p className="text-xs text-text-2 tracking-[-2%] rounded-xl">
            Providers available for you
          </p>
        </div>

        <Button className="rounded-[100px]">Book an Appointment</Button>
      </div>
    </div>
  );
};
