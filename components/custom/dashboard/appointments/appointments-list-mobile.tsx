import { Appointment } from "@/types/appointment";
import Link from "next/link";
import { IconStethoscope } from "@/components/icons";
import { formatTableDate } from "@/hooks/use-format-table-info";
import { getStatusBadge } from "./get-status-badge";

interface AppointmentListMobileProps {
  appointments: Appointment[] | undefined;
  className?: string;
}

export function AppointmentListMobile({
  appointments,
  className,
}: AppointmentListMobileProps) {
  return (
    <div className={`md:hidden  grid gap-2 ${className}`}>
      {appointments?.map((appointment) => (
        <Card appointment={appointment} key={appointment.id} />
      ))}
    </div>
  );
}

interface CardProps {
  appointment: Appointment;
}

const Card = ({ appointment }: CardProps) => {
  return (
    <Link href={`/appointments/${appointment.id}`} className="block">
      <div className=" rounded-xs p-3 bg-[#F6F8F9] grid gap-2 text-brand-1 ">
        <div className="flex justify-between pb-2 border-b border-[#DADCDD]">
          <div className="font-medium text-xs">
            {formatTableDate(appointment.date)}
          </div>
          <span className="text-xs">{getStatusBadge(appointment.status)}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <IconStethoscope className="stroke-brand-3 w-3 h-3" />
            <span className="text-xs">{appointment.consultant}</span>
          </div>
          <div className="text-brand-2 font-medium text-xs">
            {appointment.amount}
          </div>
        </div>

        <p className="flex justify-between text-xs text-brand-3">
          Service Type: {appointment?.serviceOffered}
        </p>
      </div>
    </Link>
  );
};
