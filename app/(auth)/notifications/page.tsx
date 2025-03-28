"use client";

import { IconDownload } from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { NOTIFICATION_TABLE_HEADERS } from "@/lib/constants";
import { NOTIFICATION_DATA } from "@/lib/mock";
import { cn } from "@/lib/utils";

const Notifications = () => {
  const tableData = NOTIFICATION_DATA.map((val) => {
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
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Notifications" },
        ]}
      />

      <div className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-4 md:gap-y-5">
        <h2 className="font-bold text-text-1">Notifications</h2>

        <div className="flex justify-between items-center">
          <Searchbar value={""} onChange={() => {}} placeholder={"Search"} />
          <IconDownload className="size-4 stroke-button-secondary" />
        </div>

        <TableCmp data={tableData} headers={NOTIFICATION_TABLE_HEADERS} />

        <div className="grid md:hidden w-full gap-y-2">
          {NOTIFICATION_DATA.map((val) => (
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

        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"24"}
          totalPages={"30"}
        />
      </div>
    </div>
  );
};

export default Notifications;
