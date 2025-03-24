import Image from "next/image";
import Link from "next/link";
import {
  IconCalendarCheck2,
  IconClock,
  IconExternalLink,
  IconHeart,
  IconStarFull,
} from "@/components/icons";
import { Button } from "@/components/ui";

export const UpcomingAppointmentCard = () => {
  return (
    <div className="grid gap-y-4 w-full md:w-[48%] xl:w-[32%] 3xl:w-[371px] h-[370px] max-w-full md:max-w-[48%] xl:max-w-[32%] 3xl:max-w-[371px] bg-white rounded-2xl p-3 md:p-6">
      <h3 className="text-text-2 text-sm font-semibold">
        Upcoming appointment
      </h3>

      <div className="grid gap-y-4">
        <div className="bg-input-field rounded-lg grid gap-y-3 p-3">
          <div className="flex justify-between">
            <div className="flex gap-x-2 items-start">
              <Image
                alt="man"
                className="object-cover rounded-[133.56px] h-11"
                src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={44}
                height={44}
              />

              <div className="grid gap-y-0.5">
                <h3 className="text-sm font-medium text-text-1">Jide Kosoko</h3>

                <p className="text-text-2 text-xs tracking-[-2%]">
                  Psychologist
                </p>

                <div className="flex gap-x-1 items-center">
                  <IconStarFull className="fill-actions-amber size-4" />
                  <p className="text-xs tracking-[-2%] text-text-1">4.5</p>
                </div>
              </div>
            </div>

            <IconHeart className="stroke-button-secondary size-4" />
          </div>

          <div className="border-b border-divider"></div>

          <div className="grid gap-y-3">
            <div className="flex gap-x-1 items-center">
              <IconCalendarCheck2 className="stroke-text-tertiary size-4" />
              <p className="text-xs tracking-[-2%] text-text-1">
                Wed, 12th May, 2025
              </p>
            </div>

            <div className="flex gap-x-1 items-center">
              <IconClock className="stroke-text-tertiary size-4" />
              <p className="text-xs tracking-[-2%] text-text-1">
                01:53am - 02:53am (1hr)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-400 flex justify-center items-center gap-x-2 py-[7.5px] rounded-lg">
          <Image
            src="/starting-stream.gif"
            alt="stream start"
            width={24}
            height={24}
            unoptimized
          />

          <p className="font-medium text-xs tracking-[-2%] text-button-primary">
            Provider has started the Session.{" "}
            <Link href="/join-session" className="underline">
              Join now
            </Link>
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-5">
        <Button
          variant="secondary"
          className="rounded-[100px] bg-blue-400 text-button-primary font-semibold gap-x-1 text-sm"
        >
          All Appointments
          <IconExternalLink className="stroke-button-primary" />
        </Button>

        <Button className="bg-button-primary text-white rounded-[100px] text-sm">
          Join Session
        </Button>
      </div>
    </div>
  );
};
