export interface Appointment {
  id: string;
  date: string;
  time: string;
  consultant: string;
  amount: string;
  bookedBy: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Pending";
}

export interface GetAppointmentsQuery {
  status?: string;
  start_date?: string;
  end_date?: string;
  item_per_page?: string;
  page?: string;
  component?: string;
}
