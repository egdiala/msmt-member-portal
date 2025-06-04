"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BreadcrumbCmp, RenderIf } from "@/components/shared";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  IconStarFull,
  IconCalendarCheck2,
  IconClock,
} from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { useGetAppointmentsById } from "@/services/hooks/queries/use-appointments";
import { Loader } from "@/components/shared/loader";
import { formatApptTimeShort, getSessionStatus, isEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { RatingDialog } from "../rating-form";
import { Button } from "@/components/ui";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { useAddFavouriteProvider } from "@/services/hooks/mutations/use-providers";
import { getStatusBadgeId } from "../get-status-badge";

export function formatSessionDate(dateStr: string): string {
  if (dateStr === "") return "";
  const date = parseISO(dateStr);
  return format(date, "EEE, do MMM, yyyy", { locale: enUS });
}

export default function AppointmentDetails() {
  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetAppointmentsById(slug as string);

  const { mutate, isPending } = useAddFavouriteProvider();
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
          { id: 1, name: "Home", href: "/appointments" },
          {
            id: 2,
            name: "Appointments",
          },
          { id: 3, name: data?.provider_data?.name || "" },
        ]}
      />

      <RenderIf condition={!isLoading}>
        <div className="bg-white p-4 md:p-6 rounded-lg grid gap-5  overflow-hidden">
          {/* Psychologist Info */}
          <div className="p-3 md:p-6 grid gap-3 bg-blue-400 rounded-md">
            <div className="flex items-start relative">
              <div className="flex items-center flex-row gap-x-2 md:gap-x-3 w-full">
                <div className="relative min-w-14 max-w-14 h-14 md:h-39 w-full md:min-w-39 md:max-w-39 !rounded-xs overflow-hidden">
                  <Avatar className="w-14 h-14 md:h-39 md:w-39 !rounded-xs object-cover ">
                    <AvatarImage
                      src={data?.provider_data?.avatar}
                      alt={data?.provider_data?.name}
                      className="!rounded-xs !object-cover w-full h-full"
                    />
                    <AvatarFallback className="!rounded-xs">
                      {data?.provider_data?.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="grid gap-3 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="grid gap-1 w-full">
                      <h2 className="font-bold text-brand-1 text-xl capitalize">
                        {data?.provider_data?.name}
                      </h2>
                      <p className="text-sm  text-brand-2 capitalize">
                        {data?.provider_data?.specialty}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      {/* <Button asChild className="hidden md:inline-flex">
                        <Link href={`/providers`}>
                          <IconPlus className="stroke-white" />
                          Book An Appointment
                        </Link>
                      </Button> */}
                      <RenderIf condition={data?.status === 1}>
                        <Button
                          asChild
                          className="hidden md:inline-flex text-xs md:text-sm"
                          variant="outline"
                        >
                          <Link
                            href={`/reschedule-appointment?provider_id=${data?.provider_id}&type=provider&service_type=provider&appointment_id=${data?.appointment_id}`}
                          >
                            Reschedule Appointment
                          </Link>
                        </Button>
                      </RenderIf>
                    </div>
                  </div>

                  <div className="hidden md:inline-block">
                    <Separator className="w-full" />

                    <div className="flex md:flex-row flex-col md:items-center md:justify-between">
                      <div className=" flex flex-col gap-y-3 md:py-2 md:flex-row md:items-center text-sm  text-brand-2 gap-x-6">
                        <div className="flex items-center gap-x-1">
                          <IconCalendarCheck2 className="h-4 w-4 !stroke-brand-3" />
                          <span className="text-brand-1 text-xs md:text-sm">
                            {formatSessionDate(data?.appt_date || "")}
                          </span>
                        </div>
                        <div className="flex items-center gap-x-1">
                          <IconClock className="h-4 w-4 !stroke-brand-3" />
                          <span className="text-brand-1 text-xs md:text-sm">
                            {formatApptTimeShort(Number(data?.appt_time) || 0)}
                          </span>
                        </div>
                      </div>
                      <RenderIf
                        condition={
                          data?.provider_data?.isfav_provider === false
                        }
                      >
                        <Button
                          variant={"secondary"}
                          className="flex items-center gap-1.5 border-none shadow-none"
                          disabled={isPending}
                          onClick={() => mutate(data?.provider_id as string)}
                        >
                          {isPending ? (
                            <Loader className="spinner size-4" />
                          ) : (
                            <IconStarFull className="stroke-brand-1 stroke-2 size-4" />
                          )}
                          <span className="font-semibold text-sm text-brand-1">
                            Mark as Favourite
                          </span>
                        </Button>
                      </RenderIf>
                      <RenderIf
                        condition={data?.provider_data?.isfav_provider === true}
                      >
                        <div className="flex items-center gap-1.5 border-none shadow-none pt-1.5">
                          <IconStarFull className="fill-brand-accent-2 stroke-2 size-4" />

                          <span className="font-semibold text-sm text-brand-accent-2">
                            Favourite
                          </span>
                        </div>
                      </RenderIf>
                    </div>
                  </div>
                </div>
              </div>

              {/* <Button variant={'secondary'} className="border-none bg-transparent hover:bg-transparent shadow-none" asChild>
                <Link href={``}>
                  <IconExternalLink className="h-5 w-5 stroke-brand-3 absolute right-0 top-0" />
                </Link>
              </Button> */}
            </div>

            <div className="grid gap-3 md:hidden">
              <Separator className="w-full" />

              <div className="flex md:flex-row items-start flex-col md:items-center md:justify-between">
                <div className=" flex flex-col gap-y-2 md:py-2 md:flex-row md:items-center text-sm  text-brand-2 gap-x-6">
                  <div className="flex items-center gap-x-1">
                    <IconCalendarCheck2 className="h-4 w-4 !stroke-brand-3" />
                    <span className="text-brand-1 text-xs md:text-sm">
                      {formatSessionDate(data?.appt_date || "")}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-1">
                    <IconClock className="h-4 w-4 !stroke-brand-3" />
                    <span className="text-brand-1 text-xs md:text-sm">
                      {formatApptTimeShort(Number(data?.appt_time) || 0)}
                    </span>
                  </div>

                  <RenderIf
                    condition={data?.provider_data?.isfav_provider === false}
                  >
                    <Button
                      variant={"ghost"}
                      className="flex !p-0 items-center gap-1.5 border-none shadow-none"
                      disabled={isPending}
                      onClick={() => mutate(data?.provider_id as string)}
                    >
                      {isPending ? (
                        <Loader className="spinner size-4" />
                      ) : (
                        <IconStarFull className="stroke-brand-1 stroke-2 size-4" />
                      )}
                      <span className="font-medium text-xs md:text-sm text-brand-1">
                        Mark as Favourite
                      </span>
                    </Button>
                  </RenderIf>
                  <RenderIf
                    condition={data?.provider_data?.isfav_provider === true}
                  >
                    <div className="flex items-center gap-1.5 border-none shadow-none">
                      <IconStarFull className="fill-brand-accent-2 stroke-2 size-4" />

                      <span className="font-semibold text-sm text-brand-accent-2">
                        Favourite
                      </span>
                    </div>
                  </RenderIf>
                  <div className="grid  gap-1.5">
                    {/* <Button
                      asChild
                      className="md:hidden inline-flex text-xs md:text-sm"
                    >
                      <Link href={`/providers`}>
                        <IconPlus className="stroke-white" />
                        Book An Appointment
                      </Link>
                    </Button> */}
                    <RenderIf condition={data?.status === 1}>
                      <Button
                        asChild
                        className="md:hidden inline-flex text-xs md:text-sm"
                        variant="outline"
                      >
                        <Link
                          href={`/reschedule-appointment?provider_id=${data?.provider_id}&type=provider&service_type=provider&appointment_id=${data?.appointment_id}`}
                        >
                          Reschedule Appointment
                        </Link>
                      </Button>
                    </RenderIf>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between p-4 md:px-5 py-4 border border-[#DADCDD] rounded-lg">
              <RenderIf condition={!data?.org_payer_id}>
                <div>
                  <p className="text-sm text-brand-2 mb-1">Charge</p>
                  <p className="font-medium text-brand-1 text-sm">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      minimumFractionDigits: 0,
                    }).format(data?.amount || 0)}
                  </p>
                </div>
              </RenderIf>

              <div>
                <p className="text-sm text-brand-2 mb-1">Communication Mode</p>
                <p className="font-medium text-brand-1 text-sm capitalize">
                  {data?.comm_mode}
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-2 mb-1">Status</p>
                <p className={`!font-normal !text-sm rounded-xs  `}>
                  {getStatusBadgeId(getSessionStatus(data?.status || 0))}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:justify-between p-4 md:px-5 py-4  border border-[#DADCDD] rounded-lg">
              <div>
                <p className="text-sm text-brand-2 mb-1">Service type</p>
                <p className="font-medium capitalize text-brand-1 text-sm">
                  {data?.service_offer_name}
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
                  {data?.payment_option}
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
              condition={
                !data?.rating_data.length &&
                getSessionStatus(data?.status || 0) === "Completed"
              }
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
      <RatingDialog
        open={open}
        onOpenChange={setOpen}
        personName={data?.provider_data?.name}
      />
    </div>
  );
}
