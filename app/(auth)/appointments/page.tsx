import { AppointmentContainer } from "@/components/custom/dashboard/appointments/appointments-container";
import { Suspense } from "react";

export default function AppointmentPage() {
  return (
    <Suspense>
      <AppointmentContainer />
    </Suspense>
  );
}
