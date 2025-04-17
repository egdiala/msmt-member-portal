"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Button } from "@/components/ui";
import { IconPlus } from "@/components/icons";
import { FAMILY_AND_FRIENDS_TABLE_HEADERS } from "@/lib/constants";
import { useGetFamilyAndFriends } from "@/services/hooks/queries/use-family-and-friends";
import {
  FetchedFamilyAndFriendCountType,
  FetchedFamilyAndFriendStats,
  FetchedFamilyAndFriendType,
} from "@/types/family-and-friends";
import {
  formatTableDate,
  useGetTableTotalPages,
} from "@/hooks/use-format-table-info";
import { useDebounce } from "@/hooks/use-debounce";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { FamilyAndFriendsMobileCard } from "./family-and-friends-mobile-card";
import { AddMemberModal } from "./add-member-modal";
import { TransactionStatCard } from "../wallet";

export const FamilyAndFriendsTable = () => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const searchParams = useSearchParams();
  const { value, onChangeHandler } = useDebounce(400);



  const { data: familyAndFriends, isLoading } = useGetFamilyAndFriends<
    FetchedFamilyAndFriendType[]
  >({
    page: page?.toString(),
    item_per_page: itemsPerPage.toString(),
    q: value,
  });

  const { data: familyAndFriendsCount } =
    useGetFamilyAndFriends<FetchedFamilyAndFriendCountType>({
      component: "count",
    });

  const { data: familyAndFriendsStatistics } =
    useGetFamilyAndFriends<FetchedFamilyAndFriendStats>({
      component: "count-relationship",
    });

  const familyAndFriendsStats = [
    {
      id: 1,
      title: "Total",
      value: familyAndFriendsCount?.total?.toString() ?? "0",
    },
    {
      id: 2,
      title: "Family",
      value: familyAndFriendsStatistics?.total_family?.toString() ?? "0",
    },
    {
      id: 3,
      title: "Friends",
      value: familyAndFriendsStatistics?.total_friend?.toString() ?? "0",
    },
  ];

  const tableData = familyAndFriends?.map((person) => {
    return {
      id: person.familyfriend_id,
      date_and_time: (
        <p className="text-brand-2">
          {person.createdAt ? formatTableDate(person?.createdAt) : ""}
        </p>
      ),
      name: (
        <p className="capitalize">
          {person.first_name} {person.last_name}
        </p>
      ),
      email: person.email,
      relationship: (
        <p className="capitalize">
          {person.relationship === 1 ? "Family" : "Friend"}
        </p>
      ),
    };
  });

  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setPage);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);

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
          <Searchbar onChange={onChangeHandler} placeholder={"Search"} />

          <Button
            className="gap-x-1"
            onClick={() => setOpenAddMemberModal(true)}
          >
            <IconPlus className="stroke-white" />
            Add a Member
          </Button>
        </div>

        <TableCmp
          data={tableData ?? []}
          headers={FAMILY_AND_FRIENDS_TABLE_HEADERS}
          onClickRow={(e) => router.push(`/family-and-friends/${e.id}`)}
          isLoading={isLoading}
          emptyStateTitleText="You have no family or friend yet"
        />

        <RenderIf condition={!isLoading}>
          <RenderIf condition={tableData ? tableData?.length > 0 : false}>
            <div className="md:hidden grid gap-y-2">
              {familyAndFriends?.map((person) => (
                <FamilyAndFriendsMobileCard
                  key={person.familyfriend_id}
                  {...person}
                />
              ))}
            </div>
          </RenderIf>

          <RenderIf condition={tableData ? tableData?.length > 0 : false}>
            <PaginationCmp
              onInputPage={(val) => handlePageChange(parseInt(val))}
              currentPage={page?.toString()}
              totalPages={useGetTableTotalPages({
                totalDataCount: familyAndFriendsCount?.total ?? 0,
                itemsPerPage: itemsPerPage,
              })}
            />
          </RenderIf>
        </RenderIf>
      </div>

      <AddMemberModal
        isOpen={openAddMemberModal}
        handleClose={() => setOpenAddMemberModal(false)}
      />
    </>
  );
};
