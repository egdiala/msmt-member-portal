"use client";

import { useRouter } from "next/navigation";
import { IconExternalLink } from "@/components/icons";
import { Button } from "@/components/ui";
import { NOTIFICATION_DATA } from "@/lib/mock";
import { NOTIFICATIONS } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const NotificationsCard = () => {
  const router = useRouter();
  return (
    <div className="w-full xl:w-[32%] 3xl:!w-[511px] h-[349px] max-w-full xl:max-w-[32%] 3xl:!max-w-[511px] grid gap-y-4 rounded-2xl bg-white py-[25.47px] px-[23.47px]">
      <h3 className="font-semibold text-sm text-text-2">Notifications</h3>

      <div className="grid w-full gap-y-2">
        {NOTIFICATION_DATA.slice(0, 2).map((val) => (
          <div
            key={val.id}
            className="rounded-sm bg-input-field py-4 px-3 grid gap-y-[5px]"
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
            <p className="text-xs tracking-[-2%] text-text-2 overflow-hidden whitespace-nowrap text-ellipsis max-w-[60ch]">
              {val.message}
            </p>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        className="rounded-[100px] text-button-primary gap-x-1 w-fit"
        onClick={() => router.push(NOTIFICATIONS)}
      >
        Notifications
        <IconExternalLink className="stroke-button-primary" />
      </Button>
    </div>
  );
};
