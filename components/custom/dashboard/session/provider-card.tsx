import Image from "next/image";
import { IconClock, IconCalendarCheck2 } from "@/components/icons";

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
    <div className="bg-white p-3 md:p-4 grid gap-2">
      <p className="text-sm ">Provider</p>
      <div className="bg-blue-400 p-3 rounded-lg md:rounded-xs flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={session.imageUrl || "/placeholder.svg"}
              alt={`${session.name}'s profile`}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{session.name}</h3>
            <p className="text-xs text-gray-500">{session.role}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconCalendarCheck2 className="h-4 w-4  text-brand-3" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconClock className="h-4 w-4 text-brand-3" />
            <span>
              {session.time} ({session.duration})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
