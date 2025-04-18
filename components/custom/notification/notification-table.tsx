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
import { FetchedNotification } from "@/types/notification";
import { format, formatRelative } from "date-fns";

export const NotificationTable = () => {
  const { data, isPending } = useGetAllNotifications<{ total: number }>({
    // component: "count",
    page: "1",
    item_per_page: "1",
  });
  const { data: notifications } = useGetAllNotifications<FetchedNotification[]>({
    page: "1",
    item_per_page: "3",
  });

  const { mutate, isPending: isUpdating } = useMarkNotificationAsRead();
  const tableData = notifications?.map((val) => {
    return {
      id: val.notification_id,
      date_and_time_added: (
        <div key={val.notification_id} className="flex items-center gap-x-3 pr-23">
          <div
            className={cn(
              "size-2 rounded-full",
              val.status === 1 ? "bg-none" : "bg-button-primary"
            )}
          ></div>
          <p className="capitalize">
            {formatRelative(val.createdAt, new Date()).split("at")[0]} • {format(val.createdAt, "p")}
          </p>
        </div>
      ),
      message: <p key={val.notification_id} className="whitespace-pre-wrap">{val.body}</p>,
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
        data={tableData || []}
        headers={NOTIFICATION_TABLE_HEADERS}
        emptyStateTitleText={"Nothing here"}
        emptyStateSubtitleText={"No notifications found"}
      />

      <div className="grid md:hidden w-full gap-y-2">
        {notifications?.map((val: any) => (
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
          currentPage={"1"}
          totalPages={"30"}
        />
      </RenderIf>
    </>
  );
};
