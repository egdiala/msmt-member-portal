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
import { APPOINTMENTS } from "@/lib/routes";

export const UpcomingAppointmentCard = () => {
  return (
    <div className="grid gap-y-4 order-1 md:order-2 col-span-1 xl:col-span-4 bg-white rounded-2xl p-3 md:p-6">
      <h3 className="text-text-2 text-sm font-semibold">
        Upcoming appointment
      </h3>

      <div className="grid gap-y-4">
        <div className="bg-input-field rounded-lg grid gap-y-3 p-3">
          <div className="flex justify-between">
            <div className="flex gap-x-2 items-start">
              <Image
                alt="man"
                className="object-cover rounded-full h-11"
                src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width={44}
                height={44}
              />

              <div className="grid gap-y-0.5">
                <h3 className="text-sm font-medium text-text-1">Jide Kosoko</h3>

                <p className="text-text-2 text-xs">Psychologist</p>

                <div className="flex gap-x-1 items-center">
                  <IconStarFull className="fill-actions-amber size-4" />
                  <p className="text-xs text-text-1">4.5</p>
                </div>
              </div>
            </div>

            <IconHeart className="stroke-button-secondary size-4" />
          </div>

          <div className="border-b border-divider"></div>

          <div className="grid gap-y-3">
            <div className="flex gap-x-1 items-center">
              <IconCalendarCheck2 className="stroke-text-tertiary size-4" />
              <p className="text-xs text-text-1">Wed, 12th May, 2025</p>
            </div>

            <div className="flex gap-x-1 items-center">
              <IconClock className="stroke-text-tertiary size-4" />
              <p className="text-xs text-text-1">01:53am - 02:53am (1hr)</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-400 flex justify-center items-center gap-x-2 py-2 rounded-lg">
          <Image
            src="/starting-stream.gif"
            alt="stream start"
            width={24}
            height={24}
            unoptimized
          />

          <p className="font-medium text-xs text-button-primary">
            Provider has started the Session.
            <Link href="/join-session" className="underline">
              Join now
            </Link>
          </p>
        </div>
      </div>

      <div className="flex justify-between lg:pt-5">
        <Link href={APPOINTMENTS}>
          <Button variant="secondary" className="text-button-primary gap-x-1">
            All Appointments
            <IconExternalLink className="stroke-button-primary" />
          </Button>
        </Link>

        <Link href="/session">
          <Button>Join Session</Button>
        </Link>
      </div>
    </div>
  );
};
