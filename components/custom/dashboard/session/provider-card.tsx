import Image from "next/image";
import { IconClock, IconCalendarCheck2 } from "@/components/icons";
import { Separator } from "@/components/ui/separator";

interface ProviderCardProps {
  session: {
    name: string;
    role: string;
    date: string;
    time: string;
    duration: string;
    imageUrl?: string;
  };
}

export function ProviderCard({ session }: ProviderCardProps) {
  return (
    <div className="bg-white p-3 md:p-4 grid gap-2 rounded-xl">
      <p className="text-xs md:text-base text-brand-1 font-medium md:font-semibold ">
        Provider
      </p>
      <div className="bg-blue-400 p-3 rounded-lg md:rounded-xs flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={session.imageUrl || "/assets/blank-profile-picture.png"}
              alt={`${session.name}'s profile`}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium capitalize">{session.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{session.role}</p>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col md:flex-row gap-4 md:items-center md:gap-6">
          <div className="flex items-center gap-1 text-sm text-brand-1">
            <IconCalendarCheck2 className="h-4 w-4  stroke-brand-3" />
            <span className="text-xs md:text-sm">{session.date}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-brand-1">
            <IconClock className="h-4 w-4 stroke-brand-3" />
            <span className="text-xs md:text-sm">
              {session.time} ({session.duration})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
