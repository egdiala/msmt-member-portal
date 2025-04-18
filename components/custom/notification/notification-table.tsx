"use client";

import {
  PaginationCmp,
  RenderIf,
  // Searchbar,
  TableCmp,
} from "@/components/shared";
import { NOTIFICATION_TABLE_HEADERS } from "@/lib/constants";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAllNotifications } from "@/services/hooks/queries/use-notifications";
import { Button } from "@/components/ui";
import { useMarkNotificationAsRead } from "@/services/hooks/mutations/use-notification";
import { Loader } from "@/components/shared/loader";
import { format, formatRelative } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";

export const NotificationTable = () => {
  const { page, itemsPerPage, setPage } = usePagination();

  const { data: notifications, isPending } = useGetAllNotifications({
    page: page.toString()!,
    item_per_page: itemsPerPage.toString(),
  });

  const { data: pages } = useGetAllNotifications({
    component: "count",
  });

  const { data: status } = useGetAllNotifications({
    status: "0",
  });

  const totalPages = Math.ceil(pages?.total || 0 / itemsPerPage);

  const { mutate, isPending: isUpdating } = useMarkNotificationAsRead();
  const tableData = notifications?.map((val) => {
    return {
      id: val.notification_id,
      date_and_time_added: (
        <div
          key={val.notification_id}
          className="flex items-center gap-x-3 pr-23"
        >
          <div
            className={cn(
              "size-2 rounded-full",
              val.status === 1 ? "bg-none" : "bg-button-primary"
            )}
          ></div>
          <p className="capitalize">
            {formatRelative(val.createdAt, new Date()).split("at")[0]} •{" "}
            {format(val.createdAt, "p")}
          </p>
        </div>
      ),
      message: (
        <p key={val.notification_id} className="whitespace-pre-wrap">
          {val.body}
        </p>
      ),
    };
  });
  return (
    <>
      <div className="flex justify-between items-center">
        {/* <Searchbar onChange={() => {}} placeholder={"Search"} /> */}
        <div className="flex justify-end w-full">
          <Button
            onClick={() => mutate()}
            disabled={!status?.length}
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
              <RenderIf condition={val.status === "0"}>
                <div
                  className={cn("bg-button-primary size-2 rounded-full")}
                ></div>
              </RenderIf>
            </div>
            <div className="border-b border-divider"></div>
            <p className="text-xs text-text-2">{val.message}</p>
          </div>
        ))}
      </div>

      <RenderIf condition={!!notifications?.length && !isPending}>
        <PaginationCmp
          onInputPage={(page) => setPage(Number(page))}
          currentPage={page.toString()}
          totalPages={totalPages?.toString()}
        />
      </RenderIf>
    </>
  );
};
