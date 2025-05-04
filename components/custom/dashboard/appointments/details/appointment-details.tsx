"use client";

import { useParams } from "next/navigation";
import { BreadcrumbCmp, RenderIf } from "@/components/shared";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  IconStarFull,
  IconCalendarCheck2,
  IconClock,
  IconExternalLink,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetAppointmentsById } from "@/services/hooks/queries/use-appointments";
import { Loader } from "@/components/shared/loader";
import { getSessionStatus, isEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { RatingDialog } from "../rating-form";
import { Button } from "@/components/ui";
import { useState } from "react";

export default function AppointmentDetails() {
  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetAppointmentsById(slug as string);
  console.log(data, "DATA");
  const appointment = {
    id: "completed",
    psychologist: {
      name: "Jide Kosoko",
      title: "Psychologist",
      avatar: "/assets/user-dummy.png",
    },
    date: "Wed, 12th May, 2025",
    time: "01:53am - 02:53am (1hr)",
    charge: "$40/hr",
    communicationMode: "Video",
    status: "Completed",
    serviceType: "Adult Counselling",
    bookedBy: "James John",
    method: "Wallet",
    assessment:
      "Lorem ipsum dolor sit amet consectetur. Duis ornare velit vitae lacus ipsum euismod. Nullam ultricies risus ut leo. Massa rhoncus mauris egestas duis nulla arcu in semper tortor. Sagittis suspendisse ultricies.Lorem ipsum dolor sit amet consectetur. Duis ornare velit vitae lacus ipsum euismod. Nullam",
    prescription:
      "Lorem ipsum dolor sit amet consectetur. Duis ornare velit vitae lacus ipsum euismod. Nullam ultricies risus ut leo. Massa rhoncus mauris egestas duis nulla arcu in semper tortor. Sagittis suspendisse ultricies.Lorem ipsum dolor sit amet consectetur. Duis ornare velit vitae lacus ipsum euismod. Nullam",
    feedback: {
      rating: 4.0,
      comment:
        "Lorem ipsum dolor sit amet consectetur. Duis ornare velit vitae lacus ipsum euismod. Nullam ultricies risus ut leo. Massa rhoncus mauris egestas duis nulla arcu in semper tortor. Sagittis suspendisse ultricies.Lorem ipsum dolor sit amet consectetur. Duis ornare velit vitae lacus ipsum euismod. Nullam",
    },
  };

  return (
    <div className=" grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          {
            id: 2,
            name: "Appointments",
            href: "/appointments",
          },
          { id: 3, name: data?.provider_data?.name! },
        ]}
      />

      <RenderIf condition={!isLoading}>
        <div className="bg-white p-4 md:p-6 rounded-lg grid gap-5  overflow-hidden">
          {/* Psychologist Info */}
          <div className="p-3 md:p-6 grid gap-3 bg-blue-400 rounded-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-x-2 md:gap-x-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Avatar className=" h-12 w-12 rounded-full ">
                    <AvatarImage
                      src={data?.provider_data?.avatar}
                      alt={data?.provider_data?.name}
                    />
                    <AvatarFallback>
                      {data?.provider_data?.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="font-medium text-brand-1 text-sm capitalize">
                    {data?.provider_data?.name}
                  </h2>
                  <p className="text-sm  text-brand-2 capitalize">
                    {data?.provider_data?.specialty}
                  </p>
                </div>
              </div>
              <IconExternalLink className="h-5 w-5 stroke-brand-3" />
            </div>

            <Separator />

            <div className=" flex flex-col gap-y-3 md:flex-row md:items-center text-sm  text-brand-2 gap-x-6">
              <div className="flex items-center gap-x-1">
                <IconCalendarCheck2 className="h-4 w-4 !stroke-brand-3" />
                <span className="text-brand-1 text-xs md:text-sm">
                  {appointment.date}
                </span>
              </div>
              <div className="flex items-center gap-x-1">
                <IconClock className="h-4 w-4 !stroke-brand-3" />
                <span className="text-brand-1 text-xs md:text-sm">
                  {appointment.time}
                </span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between p-4 md:px-5 py-4 border border-[#DADCDD] rounded-lg">
              <div>
                <p className="text-sm text-brand-2 mb-1">Charge</p>
                <p className="font-medium text-brand-1 text-sm">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(data?.amount!)}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-2 mb-1">Communication Mode</p>
                <p className="font-medium text-brand-1 text-sm capitalize">
                  {data?.comm_mode}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-2 mb-1">Status</p>
                <Badge
                  className={`!font-normal !text-sm rounded-xs !py-0.5 !px-2 ${
                    getSessionStatus(data?.status!) !== "Completed"
                      ? "bg-actions-blue "
                      : "bg-actions-green "
                  }`}
                >
                 {
                  getSessionStatus(data?.status!)
                 }
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between p-4 md:px-5 py-4  border border-[#DADCDD] rounded-lg">
              <div>
                <p className="text-sm text-brand-2 mb-1">Service type</p>
                <p className="font-medium text-brand-1 text-sm">
                  {appointment.serviceType}
                </p>
              </div>
              {/* <div>
                <p className="text-sm text-brand-2 mb-1">Booked by</p>
                <p className="font-medium text-brand-1 text-sm">
                  {appointment.bookedBy}
                </p>
              </div> */}
              <div>
                <p className="text-sm text-brand-2 mb-1">Method</p>
                <p className="font-medium text-brand-1 text-sm">
                  {appointment.method}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* <div className=" p-4 md:px-5 py-4 rounded-lg  border border-[#DADCDD] ">
              <h3 className="font-medium mb-2 text-sm text-brand-1">
                Assessment
              </h3>
              <p className="text-sm  text-brand-2">{appointment.assessment}</p>
            </div>
            <div className="p-4 md:px-5 py-4 rounded-lg  border border-[#DADCDD] ">
              <h3 className="font-medium mb-2 text-sm text-brand-1">
                Prescription
              </h3>
              <p className="text-sm  text-brand-2">
                {appointment.prescription}
              </p>
            </div> */}

            <RenderIf condition={!!data?.rating_data.length}>
              <div className="p-4 md:px-5 py-4 rounded-lg border border-[#DADCDD]">
                <h3 className="font-medium mb-2 text-sm text-brand-1">
                  Your after-session Feedback
                </h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="text-center border py-2 px-3 rounded-full border-brand-accent-2 bg-blue-400 text-brand-accent-2 text">
                      Great
                    </div>
                    <div className=" border py-2 px-3 rounded-full border-brand-accent-2 bg-blue-400 text-brand-accent-2 text-center">
                      I feel better now
                    </div>
                  </div>

                  <div className="flex items-center gap-x-1 py-2">
                    <IconStarFull className="fill-actions-amber size-6" />
                    <span className="text-brand-1 font-medium text-sm">
                      {" "}
                      {appointment.feedback?.rating.toFixed(1)}
                    </span>
                  </div>

                  <p className="text-sm text-brand-2">
                    {appointment.feedback?.comment}
                  </p>
                </div>
              </div>
            </RenderIf>

            <RenderIf
              condition={!data?.rating_data.length && getSessionStatus(data?.status!) === 'Completed'}
            >
              <div className="p-4 md:px-5 py-4 rounded-lg border border-[#DADCDD]">
                <div className="grid gap-3 place-content-center">
                  <EmptyState
                    hasIcon
                    title="No ratings"
                    subtitle="Click the button below to add ratings"
                  />
                  <Button
                    onClick={() => setOpen(true)}
                    className="w-fit mx-auto"
                  >
                    Add rating
                  </Button>
                </div>
              </div>
            </RenderIf>
          </div>
        </div>
      </RenderIf>
      <RenderIf condition={isLoading && isEmpty(data)}>
        <div className="grid place-content-center min-h-[400px] bg-white w-full h-full">
          <Loader />
        </div>
      </RenderIf>
      <RatingDialog open={open} onOpenChange={setOpen} personName={data?.provider_data?.name}/>
    </div>
  );
}
