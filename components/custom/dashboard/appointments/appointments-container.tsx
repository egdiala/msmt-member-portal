"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentSearch } from "./appointment-search";
import { AppliedFilters } from "./applied-filters";
import { RenderIf, TableCmp } from "@/components/shared";
import {
  getPaginationParams,
  setPaginationParams,
} from "@/hooks/use-pagination-params";
import { useGetTableTotalPages } from "@/hooks/use-format-table-info";
import { AppointmentListMobile } from "./appointments-list-mobile";
import { PaginationCmp, BreadcrumbCmp } from "@/components/shared";
import { getStatusBadge } from "./get-status-badge";
import { Appointment } from "@/types/appointment";
import { useGetAppointments } from "@/services/hooks/queries/use-appointments";
import {
  formatApptDate,
  formatApptTimeShort,
  getSessionStatus,
} from "@/lib/utils";
import { Loader } from "@/components/shared/loader";

export function AppointmentContainer() {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const [formKey, setFormKey] = useState(0); // Add a key to force form re-render when filters are cleared
  const itemsPerPage = 10;
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleApplyFilters = (filters: Record<string, any>) => {
    // Only set non-empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => 
        value !== undefined && value !== null && value !== ""
      )
    );
    setAppliedFilters(cleanFilters);
  };

  const handlePageChange = (page: number) => {
    if (!isNaN(page)) {
      setCurrentPage(page);
      setPaginationParams(page, router, searchParams);
    }
  };

  getPaginationParams(setCurrentPage);

  const handleClearFilter = (key: string) => {
    const newFilters = { ...appliedFilters };
    delete newFilters[key];
    setAppliedFilters(newFilters);
    // Force re-render the filter form to reset its state
    setFormKey(prevKey => prevKey + 1);
  };

  const handleClearAllFilters = () => {
    setAppliedFilters({}); // Reset to empty object
    // Force re-render the filter form to reset its state
    setFormKey(prevKey => prevKey + 1);
  };

  const { data, isPending } = useGetAppointments({
    page: currentPage.toString(),
    status: appliedFilters.status,
    item_per_page: itemsPerPage.toString(),
    start_date: appliedFilters.fromDate,
    end_date: appliedFilters.toDate,
  });

  const { data: count } = useGetAppointments({
    component: "count",
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
          { id: 2, name: "Appointments" },
        ]}
      />

      <div className="w-full grid gap-y-4 gap-x-6">
        <Card className="p-3 md:p-6 shadow-none border-none">
          <CardHeader className="gap-4 md:gap-5 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-brand-1 font-bold text-base">
                Appointments
              </CardTitle>
              <AppointmentSearch key={formKey} onFilter={handleApplyFilters} />
            </div>

            <RenderIf condition={Object.keys(appliedFilters).length > 0}>
              <AppliedFilters
                filters={appliedFilters}
                onClearFilter={handleClearFilter}
                onClearAll={handleClearAllFilters}
              />
            </RenderIf>
          </CardHeader>
          <RenderIf condition={!isPending}>
            <CardContent className="w-full flex flex-col min-h-[200px] gap-2 md:gap-4">
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
              <AppointmentListMobile appointments={appointments} />

              {/* Pagination */}
              <PaginationCmp
                currentPage={currentPage.toString()}
                totalPages={useGetTableTotalPages({
                  totalDataCount: (count as any)?.total ?? 0,
                  itemsPerPage: itemsPerPage,
                })}
                onInputPage={(val) => handlePageChange(parseInt(val))}
              />
            </CardContent>
          </RenderIf>
          <RenderIf condition={isPending}>
            <CardContent className="w-full grid place-content-center h-full min-h-[200px]">
              <Loader />
            </CardContent>
          </RenderIf>
        </Card>
      </div>
    </div>
  );
}