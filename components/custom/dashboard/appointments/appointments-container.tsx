"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentSearch } from "./appointment-search";
import { AppliedFilters } from "./applied-filters";
import { RenderIf, TableCmp } from "@/components/shared";
import { AppointmentListMobile } from "./appointments-list-mobile";
import { PaginationCmp, BreadcrumbCmp } from "@/components/shared";
import { UpcomingAppointmentCard } from "../upcoming-appointment-card";
import { getStatusBadge } from "./get-status-badge";
import { Appointment } from "@/types/appointment";
import { capitalizeFirstLetter } from "@/lib/hooks";
import { CancelAppointmentDialog } from "./cancel-appointments-dialog";
import { useGetAppointments } from "@/services/hooks/queries/use-appointments";
import { formatApptDate, formatApptTimeShort, getSessionStatus } from "@/lib/utils";
import { Loader } from "@/components/shared/loader";

export function AppointmentContainer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState("1");
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters({ ...appliedFilters, ...filters });
  };

  const handleClearFilter = (key: string) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[key];
    setAppliedFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({});
  };
  const { data, isPending } = useGetAppointments({
    page: currentPage,
    // search: searchQuery,
    status: appliedFilters.status,
    start_date: appliedFilters.fromDate,
    end_date: appliedFilters.toDate,
  });

  const appointments: Appointment[] | undefined = data?.map((item) => ({
    id: item?.appointment_id,
    date: formatApptDate(item.appt_date),
    time: formatApptTimeShort(item?.appt_time),
    amount: new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(item?.amount),
    consultant: item?.provider_data?.name,
    serviceOffered: item?.service_offer_name
      .split(" ")
      .map(
        (item) =>
          item.charAt(0).toUpperCase() + item.split("").slice(1).join("")
      )
      .join(" "),
    status: getSessionStatus(item?.status),
  }));

  const headers = [
    { key: "date", value: "Date & Time" },
    { key: "consultant", value: "Consultant" },
    { key: "amount", value: "Amount" },
    { key: "serviceOffered", value: "Service Offerred" },
    { key: "status", value: "Status" },
  ];

  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Home", href: "/home" },
          { id: 2, name: capitalizeFirstLetter(pathname.split("/")[1]) },
        ]}
      />

      <div className="w-full grid gap-y-4 lg:grid-cols-3 gap-x-6">
        <Card className="p-3 md:p-6 shadow-none border-none lg:col-span-2">
          <CardHeader className="gap-4 md:gap-5 pb-0">
            <CardTitle className="text-brand-1 font-bold text-base">
              Appointments
            </CardTitle>
            <AppointmentSearch
              onSearch={handleSearch}
              onFilter={handleApplyFilters}
            />

            <AppliedFilters
              filters={appliedFilters}
              onClearFilter={handleClearFilter}
              onClearAll={handleClearAllFilters}
            />
          </CardHeader>
          <RenderIf condition={!isPending}>
            <CardContent className="w-full flex flex-col min-h-[200px]  h-full justify-between">
              <TableCmp
                data={(appointments as Appointment[])?.map((apt) => ({
                  ...apt,
                  date: `${apt.date} • ${apt.time}`,
                  status: getStatusBadge(apt.status),
                }))}
                isLoading={isPending}
                onClickRow={(value) =>
                  router.push(`/appointments/${value?.id}`)
                }
                headers={headers}
                emptyStateTitleText="No data available"
              />

              {/* Mobile list view */}
              <AppointmentListMobile
                appointments={appointments}
                onAppointmentClick={(appointment) =>
                  router.push(`/appointments/${appointment?.id}`)
                }
              />

              {/* Pagination */}
              <PaginationCmp
                currentPage={currentPage}
                totalPages={"3"}
                onInputPage={(page) => setCurrentPage(page)}
              />
            </CardContent>
          </RenderIf>
          <RenderIf condition={isPending}>
            <CardContent className="w-full grid place-content-center h-full">
              <Loader />
            </CardContent>
          </RenderIf>
        </Card>
        <div className="h-fit w-full lg:w-fit col-span-1">
          <UpcomingAppointmentCard onCancel={() => setOpenCancelModal(true)} />
        </div>
      </div>
      <CancelAppointmentDialog
        onCancel={() => {}}
        open={openCancelModal}
        onOpenChange={setOpenCancelModal}
      />
    </div>
  );
}
