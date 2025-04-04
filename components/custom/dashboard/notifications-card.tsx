"use client";

import Link from "next/link";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { NOTIFICATION_DATA } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const NotificationsCard = () => {
  return (
    <div className="col-span-1 md:col-span-2 xl:col-span-5 flex flex-col gap-y-4 rounded-2xl bg-white py-6 px-4 md:px-6">
      <h3 className="font-semibold text-sm text-text-2">Notifications</h3>

      <div className="flex flex-col w-full gap-y-2 flex-1">
        {NOTIFICATION_DATA.slice(0, 2).map((val) => (
          <div
            key={val.id}
            className="rounded-sm bg-input-field py-4 px-3 grid gap-y-1.5"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-xs text-text-1">
                {val.date} • {val.time}
              </p>
              <div
                className={cn(
                  "bg-button-primary size-2 rounded-full",
                  val.status === "unread" ? "inline-flex" : "hidden"
                )}
              ></div>
            </div>
            <div className="border-b border-divider"></div>
            <p className="text-xs text-text-2 overflow-hidden whitespace-nowrap text-ellipsis max-w-[60ch]">
              {val.message}
            </p>
          </div>
        ))}
      </div>

      
      <Button asChild variant="secondary" className="text-button-primary gap-x-1 w-fit">
        <Link href="/notifications">
          Notifications
          <IconExternalLink className="stroke-button-primary" />
        </Link>
      </Button>
    </div>
  );
};
