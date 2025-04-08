export interface Appointment {
    id: string
    date: string
    time: string
    consultant: string
    amount: string
    bookedBy: string
    status: "Upcoming" | "Completed" | "Cancelled" | "Pending"
  }
  
  