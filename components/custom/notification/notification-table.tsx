"use client";

import {
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { NOTIFICATION_TABLE_HEADERS } from "@/lib/constants";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllNotifications } from "@/services/hooks/queries/use-notifications";
import { Button } from "@/components/ui";
import { useMarkNotificationAsRead } from "@/services/hooks/mutations/use-notification";
import { Loader } from "@/components/shared/loader";

export const NotificationTable = () => {
  const { data, isPending } = useGetAllNotifications<{ total: number }>({
    // component: "count",
    page: "1",
    item_per_page: "1",
  });

  console.log(data, "DATA")


  const { mutate, isPending: isUpdating } = useMarkNotificationAsRead();
  const tableData = ([] as any).map((val: any) => {
    return {
      id: val.id,
      date_and_time_added: (
        <div className="flex items-center gap-x-3 pr-23">
          <div
            className={cn(
              "size-2 rounded-full",
              val.status === "read" ? "bg-none" : "bg-button-primary"
            )}
          ></div>
          <p>
            {val.date} • {val.time}
          </p>
        </div>
      ),
      message: <p className="whitespace-pre-wrap">{val.message}</p>,
    };
  });
  return (
    <>
      <div className="flex justify-between items-center">
        <Searchbar onChange={() => {}} placeholder={"Search"} />
        <Button
          onClick={() => mutate()}
          disabled={data?.total === 0 || isPending}
          variant={"secondary"}
        >
          {isUpdating ? (
            <Loader />
          ) : (
            <div className="flex items-center gap-x-2">
              {" "}
              Mark all as read
              <CheckCheck className="size-4 stroke-button-secondary" />
            </div>
          )}
        </Button>
      </div>

      <TableCmp
        isLoading={isPending}
        data={tableData}
        headers={NOTIFICATION_TABLE_HEADERS}
        emptyStateTitleText={"Nothing here"}
        emptyStateSubtitleText={"No notifications found"}
      />

      <div className="grid md:hidden w-full gap-y-2">
        {[].map((val: any) => (
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
            <p className="text-xs text-text-2">{val.message}</p>
          </div>
        ))}
      </div>

      <RenderIf condition={data?.total !== 0 && !isPending}>
        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"24"}
          totalPages={"30"}
        />
      </RenderIf>
    </>
  );
};
