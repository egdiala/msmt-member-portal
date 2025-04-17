"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { BreadcrumbCmp, RenderIf } from "@/components/shared";
import { Avatar, AvatarFallback, Badge, Button } from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { cn } from "@/lib/utils";
import { useGetSingleFamilyOrFriend } from "@/services/hooks/queries/use-family-and-friends";
import { FetchedSingleFamilyOrFriendType } from "@/types/family-and-friends";
import { RemoveMemberModal } from "./remove-member-modal";
import { ActivateMemberModal } from "./activate-member-modal";
import { capitalizeFirstLetter } from "@/lib/hooks";

export const SingleFamilyOrFriendContent = () => {
  const { id } = useParams();
  const { data: user, isLoading } =
    useGetSingleFamilyOrFriend<FetchedSingleFamilyOrFriendType>({
      familyfriend_id: id as string,
    });

  const userStatus: string = user?.status === 1 ? "Active" : "Suspended";

  const userInfo = [
    { id: 1, title: "Phone", value: user?.phone_number || "N/A" },
    {
      id: 2,
      title: "Gender",
      value: capitalizeFirstLetter(user?.gender || "") || "N/A",
    },
    {
      id: 3,
      title: "Status",
      value: userStatus,
    },
    {
      id: 4,
      title: "Total appointment",
      value: formatNumberWithCommas(user?.total_appointment ?? 0),
    },
    {
      id: 5,
      title: "Total money spent",
      value: formatNumberWithCommas(user?.total_spent ?? 0, "NGN"),
    },
  ];

  const [openRemoveMemberModal, setOpenRemoveMemberModal] = useState(false);
  const [openActivateMemberModal, setOpenActivateMemberModal] = useState(false);

  return (
    <>
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Family & Friends", href: "/family-and-friends" },
          { id: 3, name: user ? `${user?.first_name} ${user?.last_name}` : "" },
        ]}
      />

      <div className="grid gap-y-5">
        <div className="rounded-lg md:rounded-2xl bg-white p-3 md:p-6 grid gap-y-4">
          <RenderIf condition={!isLoading}>
            <div className="flex items-start md:items-center gap-4 justify-between flex-col md:flex-row">
              <div className="flex gap-x-4 items-center">
                <Avatar className="size-16">
                  <AvatarFallback>
                    {user?.first_name[0]}
                    {user?.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="grid gap-y-0.5">
                  <h4 className="text-2xl font-bold text-brand-1">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-sm text-brand-2">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                <Button
                  variant="secondary"
                  onClick={() => setOpenRemoveMemberModal(true)}
                >
                  Remove
                </Button>

                <Button onClick={() => setOpenActivateMemberModal(true)}>
                  {userStatus === "Active" ? "Suspend" : "Activate"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 py-4 md:py-4.5 px-4 flex-col md:flex-row gap-5 border border-divider rounded-lg">
              {userInfo.map((info) => (
                <div key={info.id} className="grid gap-y-1 text-sm">
                  <h5 className="text-brand-2">{info.title}</h5>

                  <RenderIf condition={info.title !== "Status"}>
                    <p className="text-brand-1 font-medium">{info.value}</p>
                  </RenderIf>

                  <RenderIf condition={info.title === "Status"}>
                    <Badge
                      className={cn(
                        "text-white text-sm font-medium capitalize",
                        info.value === "Active"
                          ? "bg-actions-green"
                          : info.value === "Suspended"
                          ? "bg-red-500"
                          : "bg-grey-300"
                      )}
                    >
                      {info.value}
                    </Badge>
                  </RenderIf>
                </div>
              ))}
            </div>
          </RenderIf>

          <RenderIf condition={isLoading}>
            <div className="w-full h-30 flex justify-center items-center">
              <Loader />
            </div>
          </RenderIf>
        </div>
      </div>

      <RemoveMemberModal
        handleClose={() => setOpenRemoveMemberModal(false)}
        isOpen={openRemoveMemberModal}
        familyfriend_id={user?.familyfriend_id ?? ""}
        memberName={user ? `${user?.first_name} ${user?.last_name}` : ""}
      />

      <ActivateMemberModal
        isOpen={openActivateMemberModal}
        handleClose={() => setOpenActivateMemberModal(false)}
        memberDetail={{
          first_name: user?.first_name ?? "",
          last_name: user?.last_name ?? "",
          status: userStatus,
          familyfriend_id: user?.familyfriend_id ?? "",
        }}
      />
    </>
  );
};
