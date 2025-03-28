"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconCalendarCheck2,
  IconClock,
  IconDownload,
  IconHeart,
  IconStarFull,
} from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Button, Badge } from "@/components/ui";
import {
  FilterAppointmentsPopover,
  AppointmentsMobileCard,
  EditMemberModal,
  ActivateMemberModal,
  RemoveMemberModal,
} from "@/components/custom";
import { cn } from "@/lib/utils";
import { FAMILY_AND_FRIENDS_APPOINTMENTS_DATA } from "@/lib/mock";
import { FAMILY_AND_FRIENDS_APPOINTMENTS_TABLE_HEADERS } from "@/lib/constants";

const SingleFamilyOrFriend = () => {
  const userStatus: string = "active";

  const userInfo = [
    { id: 1, title: "Phone", value: "0801 234 5678" },
    { id: 2, title: "Gender", value: "Male" },
    { id: 3, title: "Status", value: userStatus },
  ];

  const appointmentStats = [
    { id: 1, title: "Total", value: "214" },
    { id: 2, title: "Upcoming", value: "49" },
    { id: 3, title: "Completed", value: "152" },
    { id: 4, title: "Total money spent", value: "N/A" },
  ];

  const tableData = FAMILY_AND_FRIENDS_APPOINTMENTS_DATA.map((appointment) => {
    return {
      id: appointment.id,
      date_and_time: (
        <p className="text-brand-2">
          {appointment.date} • {appointment.time}
        </p>
      ),
      consultant: <p className="capitalize">{appointment.consultant}</p>,
      booked_by: <p className="capitalize">{appointment.booked_by}</p>,
      status: (
        <>
          <RenderIf condition={appointment.status === "upcoming"}>
            <p className="text-blue-action capitalize font-medium">
              {appointment.status}
            </p>
          </RenderIf>

          <RenderIf condition={appointment.status === "pending"}>
            <p className="text-actions-amber capitalize font-medium">
              {appointment.status}
            </p>
          </RenderIf>

          <RenderIf condition={appointment.status === "canceled"}>
            <p className="text-status-danger capitalize font-medium">
              {appointment.status}
            </p>
          </RenderIf>

          <RenderIf condition={appointment.status === "completed"}>
            <p className="text-actions-green capitalize font-medium">
              {appointment.status}
            </p>
          </RenderIf>
        </>
      ),
    };
  });

  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openRemoveMemberModal, setOpenRemoveMemberModal] = useState(false);
  const [openActivateMemberModal, setOpenActivateMemberModal] = useState(false);

  return (
    <div className="w-full grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: "Family & Friends", href: "/family-and-friends" },
          { id: 3, name: "James Dada" },
        ]}
      />

      <div className="grid md:grid-cols-10 xl:grid-cols-12 gap-x-5 content-start">
        <div className="md:col-span-6 xl:col-span-9 grid gap-y-5">
          <div className="rounded-lg md:rounded-2xl bg-white p-3 md:p-6 grid gap-y-4">
            <div className="flex gap-x-4 items-center">
              <Image
                src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="profile img"
                width={64}
                height={64}
                className="h-16 rounded-full object-cover bg-grey-300"
              />

              <div className="grid gap-y-0.5">
                <h4 className="text-2xl font-bold text-brand-1">James Dada</h4>
                <p className="text-sm text-brand-2">example@email.com</p>
              </div>
            </div>

            <div className="flex justify-between py-0.5 flex-col md:flex-row gap-5">
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
                        info.value === "active"
                          ? "bg-actions-green"
                          : info.value === "deactivated"
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

            <div className="border-b border-divider"></div>

            <div className="flex items-center gap-x-4">
              <Button
                variant="secondary"
                onClick={() => setOpenEditProfileModal(true)}
              >
                Edit Profile
              </Button>

              <RenderIf condition={userStatus === "active"}>
                <Button
                  variant="secondary"
                  onClick={() => setOpenRemoveMemberModal(true)}
                >
                  Remove Member
                </Button>
              </RenderIf>

              <RenderIf condition={userStatus === "inactive"}>
                <Button
                  variant="secondary"
                  onClick={() => setOpenActivateMemberModal(true)}
                >
                  Activate Member
                </Button>
              </RenderIf>
            </div>
          </div>

          <div className="rounded-lg md:rounded-2xl bg-white p-3 md:p-6 grid gap-y-5">
            <h2 className="font-bold text-brand-1">Appointments</h2>

            <div className="flex justify-between gap-5 flex-col md:flex-row p-4 flex-wrap border border-divider rounded-lg">
              {appointmentStats.map((stat) => (
                <div key={stat.id} className="grid gap-y-1">
                  <p className="text-sm text-brand-2">{stat.title}</p>
                  <p className="text-lg font-medium text-brand-1">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 md:pt-0 flex items-center justify-between gap-3 flex-row">
              <Searchbar
                value={""}
                onChange={() => {}}
                placeholder={"Search"}
              />

              <div className="flex items-center gap-x-4">
                <Button
                  variant="outline"
                  className="py-2 px-2 md:px-3 shadow-none border-none hover:border"
                >
                  <IconDownload className="stroke-brand-btn-secondary" />
                </Button>

                <FilterAppointmentsPopover />
              </div>
            </div>

            <TableCmp
              data={tableData}
              headers={FAMILY_AND_FRIENDS_APPOINTMENTS_TABLE_HEADERS}
            />

            <div className="md:hidden grid gap-y-2">
              {FAMILY_AND_FRIENDS_APPOINTMENTS_DATA.map((appointment) => (
                <AppointmentsMobileCard key={appointment.id} {...appointment} />
              ))}
            </div>

            <PaginationCmp
              onInputPage={() => {}}
              currentPage={"24"}
              totalPages={"30"}
            />
          </div>
        </div>

        <div className="hidden md:grid h-fit md:col-span-4 xl:col-span-3 rounded-2xl bg-white md:p-6  gap-y-4 sticky top-40 content-start">
          <h2 className="text-brand-1 font-bold">Upcoming appointment</h2>

          <div className="bg-input-field rounded-lg p-3 grid gap-y-3">
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                <Image
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="image"
                  width={44}
                  height={44}
                  className="h-11 rounded-full object-cover bg-grey-300"
                />

                <div className="grid gap-y-0.5">
                  <h3 className="font-medium text-brand-1 text-sm">
                    Jide Kosoko
                  </h3>
                  <p className="text-brand-2 text-xs">Psychologist</p>
                  <div className="flex items-center gap-x-1">
                    <IconStarFull className="fill-actions-amber size-4" />
                    <p className="text-brand-1 text-xs">4.5</p>
                  </div>
                </div>
              </div>

              <IconHeart className="stroke-brand-btn-secondary" />
            </div>

            <div className="border-b border-divider"></div>

            <div className="grid gap-y-3">
              <div className="flex items-center gap-x-1">
                <IconCalendarCheck2 className="stroke-brand-3 size-4" />
                <p className="text-brand-1 text-xs">Wed, 12th May, 2025</p>
              </div>

              <div className="flex items-center gap-x-1">
                <IconClock className="stroke-brand-3 size-4" />
                <p className="text-brand-1 text-xs">01:53am - 02:53am (1hr)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditMemberModal
        handleClose={() => setOpenEditProfileModal(false)}
        isOpen={openEditProfileModal}
      />

      <RemoveMemberModal
        handleClose={() => setOpenRemoveMemberModal(false)}
        isOpen={openRemoveMemberModal}
      />

      <ActivateMemberModal
        isOpen={openActivateMemberModal}
        handleClose={() => setOpenActivateMemberModal(false)}
      />
    </div>
  );
};

export default SingleFamilyOrFriend;
