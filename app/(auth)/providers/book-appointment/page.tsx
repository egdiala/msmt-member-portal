import { Suspense } from "react";
import { BookAppointmentContent } from "@/components/custom";

const BookAppointment = () => {
  return (
    <div className="md:absolute md:top-0 md:bottom-0 md:left-0 md:right-0 md:bg-portal md:z-50 md:h-screen md:overflow-y-scroll">
      <Suspense>
        <BookAppointmentContent />
      </Suspense>
    </div>
  );
};

export default BookAppointment;
