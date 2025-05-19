"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { OrganizationCard } from "./organization-card";
import { ProviderCard } from "./provider-card";
import Link from "next/link";
import { formatApptTimeShort } from "@/lib/utils";
import { formatSessionDate } from "../appointments/details/appointment-details";
import { useGetAppointmentsById } from "@/services/hooks/queries/use-appointments";
// import { useGetProfile } from "@/services/hooks/queries/use-profile";

export function StartSession() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user_id = searchParams.get("user_id");
  const appointment_id = searchParams.get("appointment_id");
  const { data } = useGetAppointmentsById(appointment_id as string);
  // const { data: account } = useGetProfile();


  const provider = {
    name: data?.provider_data?.name || "-",
    role: data?.provider_data?.specialty || "-",
    imageUrl: data?.provider_data?.avatar,
    date: formatSessionDate(data?.appt_date || ""),
    time: formatApptTimeShort(Number(data?.appt_time) || 0),
    duration: "1 hour",
  };

  // const organization = {
  //   name: account?.org_data[0]?.name || "-",
  //   avatar: account?.org_data[0]?.avatar,
  //   type: account?.org_data[0]?.industry_name || "-",
  // };
  return (
    <div className="w-full max-w-screen-sm mx-auto space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand-1">Welcome</h1>
        <p className="text-sm text-brand-2">
          You&apos;re about to join a session with the below details
        </p>
      </div>

      {/* Organization */}

      <div className="grid md:gap-4 gap-8">
        {/* <OrganizationCard organization={organization} /> */}
        <ProviderCard session={provider} />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center items-center gap-4 md:gap-5">
        <Button
          variant="secondary"
          className="text-brand-3 py-3 px-4 h-12 flex-1 md:flex-none"
          onClick={() => router.push("/home")}
        >
          Go to Home
        </Button>
        <Button className="h-12 flex-1 md:flex-none py-3 px-4" asChild>
          <Link
            href={`/start-session?user_id=${user_id}&appointment_id=${appointment_id}`}
          >
            Join Session
          </Link>
        </Button>
      </div>
    </div>
  );
}
