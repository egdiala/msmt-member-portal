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

export function StartSession({
  organization,
  provider,
}: SessionCardProps) {
  const router = useRouter()
  return (
    <div className="w-full max-w-screen-sm mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-brand-1">Welcome</h1>
        <p className="text-sm text-brand-2">
          You're about to join a session with the below details
        </p>
      </div>

      <div className="space-y-4">
        {/* Organization */}

        <OrganizationCard organization={organization} />
        <ProviderCard session={provider} />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center items-center gap-5">
        <Button variant="secondary" className="text-gray-600" onClick={()=>router.push('/home')}>
          Go to Home
        </Button>
        <Button  onClick={()=> router.push('/session')}>
          Join Session
        </Button>
      </div>
    </div>
  );
}
