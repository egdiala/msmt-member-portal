"use client";

import { Suspense } from "react";
import { RescheduleAppointmentForm } from "@/components/custom/providers/reschedule-appointment-form";

export default function RescheduleAppointmentFormPage() {
  return (
    <div className="mx-auto w-full max-w-2xl ">
      <Suspense>
        <RescheduleAppointmentForm />
      </Suspense>
    </div>
  );
}
