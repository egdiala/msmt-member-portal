"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { OrganizationCard } from "./organization-card";
import { ProviderCard } from "./provider-card";
import { parseISO, format } from "date-fns";
import { useGetLiveSession } from "@/services/hooks/queries/use-appointments";

import { RenderIf } from "@/components/shared";
import { useMemo } from "react";

export function StartSession() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user_id = searchParams.get("user_id");
  const provider_id = searchParams.get("provider_id");
  const appointment_id = searchParams.get("appointment_id");

  const { data } = useGetLiveSession({
    appointment_id: appointment_id as string,
    user_id: user_id as string,
  });
  const startDate = useMemo(() => {
    return data?.end_at ? parseISO(data.end_at) : new Date();
  }, [data?.end_at]);

  const provider = {
    name: !!provider_id ? data?.member_name : data?.provider_name || "-",
    role: !!provider_id ? "Patient" : data?.provider_specialty || "-",
    imageUrl: !!provider_id ? data?.member_avatar : data?.provider_avatar,
    date: format(startDate, "do MMMM yyyy"),
    time: format(startDate, "h:mm a"),
    duration: "1 hour",
  };

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
        <RenderIf condition={!!data?.token}>
          <Button className="h-12 flex-1 md:flex-none py-3 px-4" asChild>
            <a
              href={`/start-session?user_id=${user_id}&appointment_id=${appointment_id}${
                provider_id ? `&provider_id=${provider_id}` : ""
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="decoration-none text-white font-semibold flex items-center justify-center h-full"
            >
              Join Session
            </a>
          </Button>
        </RenderIf>
      </div>
    </div>
  );
}
