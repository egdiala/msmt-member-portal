"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconHospital,
  IconStarFull,
  IconStethoscope,
} from "@/components/icons";
import { RenderIf } from "@/components/shared";
import { Avatar, AvatarImage } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ISingleProviderCard {
  id: number;
  img: string;
  type: string;
  name: string;
  title: string;
  rating: string;
  rate: string;
  isOrganisation?: boolean;
}
export const SingleProviderCard = (provider: ISingleProviderCard) => {
  const { id } = useParams();
  return (
    <Link
      href={
        provider.isOrganisation
          ? `/providers/organisation/${id}/single/${provider.id}`
          : provider.type?.toLowerCase() === "individual"
          ? `/providers/individual/${provider.id}`
          : `/providers/organisation/${provider.id}`
      }
      className="border border-divider rounded-lg p-1"
    >
      <div className="relative">
        <Avatar className="rounded-sm w-full h-20 md:h-32">
          <AvatarImage
            src={provider.img}
            className="w-full object-cover hover:scale-150 transition-transform transform duration-200"
            alt="provider"
          />
        </Avatar>

        <div
          className={cn(
            "w-fit capitalize px-1 py-0.5 flex gap-x-1 text-xs text-brand-2 absolute top-1 left-1 rounded-sm",
            provider.type?.toLowerCase() === "individual"
              ? "bg-blue-400"
              : "bg-brand-bkg-3"
          )}
        >
          <RenderIf condition={provider.type?.toLowerCase() === "individual"}>
            <IconStethoscope className="stroke-brand-btn-secondary size-3" />
            {provider.type}
          </RenderIf>

          <RenderIf condition={provider.type?.toLowerCase() === "organisation"}>
            <IconHospital className="stroke-brand-btn-secondary size-3" />
            {provider.type}
          </RenderIf>
        </div>
      </div>

      <div className="grid gap-y-4 py-1 px-0.5">
        <div className="grid gap-y-0.5">
          <h2 className="font-medium text-brand-1 text-[10px] md:text-base">
            {provider.name}
          </h2>
          <p className="text-[8px] md:text-xs text-brand-2">{provider.title}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-0.5 text-xs text-brand-1">
            <IconStarFull className="fill-actions-amber size-4" />
            4.5
          </div>

          <p className="font-medium text-xs">From {provider.rate}/hr</p>
        </div>
      </div>
    </Link>
  );
};
