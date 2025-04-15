"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaginationCmp, Searchbar, TableCmp } from "@/components/shared";
import { Button } from "@/components/ui";
import { IconDownload, IconPlus } from "@/components/icons";
import { FAMILY_AND_FRIENDS_TABLE_HEADERS } from "@/lib/constants";
import { FAMILY_AND_FRIENDS_LIST } from "@/lib/mock";
import { FamilyAndFriendsMobileCard } from "./family-and-friends-mobile-card";
import { AddMemberModal } from "./add-member-modal";
import { TransactionStatCard } from "../wallet";

export const FamilyAndFriendsTable = () => {
  const familyAndFriendsStats = [
    { id: 1, title: "Total", value: "14" },
    { id: 2, title: "Family", value: "2,853" },
    {
      id: 3,
      title: "Friends",
      value: "2,853",
    },
  ];

  const tableData = FAMILY_AND_FRIENDS_LIST.map((person) => {
    return {
      id: person.id,
      date_and_time: (
        <p className="text-brand-2">
          {person.date} • {person.time}
        </p>
      ),
      name: <p className="capitalize">{person.name}</p>,
      email: person.email,
      relationship: <p className="capitalize">{person.relationship}</p>,
    };
  });

  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        {familyAndFriendsStats.map((stat) => (
          <TransactionStatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            className="bg-grey-400"
            hideCurrency
          />
        ))}
      </div>

      <div className="bg-white rounded-lg md:rounded-2xl p-3 md:p-6 grid gap-y-4 md:gap-y-5">
        <h3 className="font-bold text-brand-1">Family & Friends</h3>

        <div className="flex items-end md:items-center justify-between gap-3 flex-col md:flex-row">
          <Searchbar value={""} onChange={() => {}} placeholder={"Search"} />

          <div className="flex items-center gap-x-4">
            <Button
              variant="outline"
              className="py-2 px-2 md:px-3 shadow-none border-none hover:border"
            >
              <IconDownload className="stroke-brand-btn-secondary" />
            </Button>

            <Button
              className="gap-x-1"
              onClick={() => setOpenAddMemberModal(true)}
            >
              <IconPlus className="stroke-white" />
              Add a Member
            </Button>
          </div>
        </div>

        <TableCmp
          data={tableData}
          headers={FAMILY_AND_FRIENDS_TABLE_HEADERS}
          onClickRow={(e) => router.push(`/family-and-friends/${e.id}`)}
        />

        <div className="md:hidden grid gap-y-2">
          {FAMILY_AND_FRIENDS_LIST.map((person) => (
            <FamilyAndFriendsMobileCard key={person.id} {...person} />
          ))}
        </div>

        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"24"}
          totalPages={"30"}
        />
      </div>

      <AddMemberModal
        isOpen={openAddMemberModal}
        handleClose={() => setOpenAddMemberModal(false)}
      />
    </>
  );
};
