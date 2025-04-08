"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrganizationCard } from "./organization-card";
import { ProviderCard } from "./provider-card";


interface SessionCardProps {
  organization: {
    name: string;
    type: string;
  };
  provider: {
    name: string;
    role: string;
    imageUrl?: string;
    date: string;
    time: string;
    duration: string;
  };
}

export function StartSession({ organization, provider }: SessionCardProps) {
  const router = useRouter();

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
        <OrganizationCard organization={organization} />
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
        <Button
          className="h-12 flex-1 md:flex-none py-3 px-4"
          onClick={() => {
          router.push('/start-session')
          }}
        >
          Join Session
        </Button>
      </div>
    </div>
  );
}
