"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppointmentSearch } from "./appointment-search";
import { AppliedFilters } from "./applied-filters";
import { TableCmp } from "@/components/shared";
import { AppointmentListMobile } from "./appointments-list-mobile";
import { PaginationCmp } from "@/components/shared";
import { UpcomingAppointmentCard } from "../upcoming-appointment-card";
import { getStatusBadge } from "./get-status-badge";
// import { AppointmentDetails } from "./appointment-details";
import { Appointment } from "@/types/appointment";

export function AppointmentContainer() {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({
    name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const appointments: Appointment[] = [
    {
      id: "1",
      date: "Today",
      time: "12:34pm",
      consultant: "Adeboyega Precious",
      amount: "₦50,000",
      bookedBy: "Work",
      status: "Upcoming",
    },
    {
      id: "2",
      date: "Today",
      time: "12:34pm",
      consultant: "Jide Kosoko",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Upcoming",
    },
    {
      id: "3",
      date: "Today",
      time: "12:34pm",
      consultant: "Nneka Chukwu",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Completed",
    },
    {
      id: "4",
      date: "Today",
      time: "12:34pm",
      consultant: "Adebayo Salami",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Cancelled",
    },
    {
      id: "5",
      date: "Today",
      time: "12:34pm",
      consultant: "Diamond Tutu",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Completed",
    },
    {
      id: "6",
      date: "Today",
      time: "12:34pm",
      consultant: "Adebayo Bolaji",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Completed",
    },
    {
      id: "7",
      date: "Today",
      time: "12:34pm",
      consultant: "Baba Kauffat",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Completed",
    },
    {
      id: "8",
      date: "Today",
      time: "12:34pm",
      consultant: "Jibola Alarape",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Completed",
    },
    {
      id: "9",
      date: "Today",
      time: "12:34pm",
      consultant: "Eze Chinweu",
      amount: "₦50,000",
      bookedBy: "You",
      status: "Completed",
    },
  ];

  const headers = [
    { key: "date", value: "Date & Time" },
    { key: "consultant", value: "Consultant" },
    { key: "amount", value: "Amount" },
    { key: "bookedBy", value: "Booked By" },
    { key: "status", value: "Status" },
  ];

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

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

  return (
    <div className="w-full grid lg:grid-cols-3 gap-x-6">
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
        <CardContent className="w-full">
          <TableCmp
            data={appointments.map((apt) => ({
              ...apt,
              date: `${apt.date} • ${apt.time}`,
              status: getStatusBadge(apt.status),
            }))}
            headers={headers}
          />

          {/* Mobile list view */}
          <AppointmentListMobile
            appointments={appointments}
            onAppointmentClick={handleAppointmentClick}
          />

          {/* Pagination */}
          <PaginationCmp
            currentPage={currentPage}
            totalPages={30}
            onPageChange={setCurrentPage}
          
          />
        </CardContent>
      </Card>
      <div className="h-fit w-full lg:w-fit col-span-1">
        <UpcomingAppointmentCard />
      </div>
    </div>
  );
}
