import { IconStethoscope } from "@/components/icons";
import { RenderIf } from "@/components/shared";

interface IAppointmentsMobileCard {
  id: number | string;
  date: string;
  time: string;
  consultant: string;
  booked_by: string;
  status: string;
}
export const AppointmentsMobileCard = (
  appointment: IAppointmentsMobileCard
) => {
  return (
    <div
      key={appointment.id}
      className="bg-input-field px-3 py-4 grid gap-y-2 rounded-sm"
    >
      <div className="flex items-center justify-between font-medium text-xs capitalize">
        <h3 className="text-brand-1">
          {appointment.date} • {appointment.time}
        </h3>

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
      </div>

      <div className="border-b border-divider"></div>

      <div className="flex justify-between">
        <div className="grid gap-y-2">
          <div className="flex items-center gap-x-1">
            <IconStethoscope className="stroke-brand-3 size-3" />
            <p className="text-xs text-brand-1 whitespace-pre-wrap">
              {appointment.consultant}
            </p>
          </div>

          <p className="text-brand-3 text-xs">
            Booked by: {appointment.booked_by}
          </p>
        </div>

        <p className="text-brand-2 font-medium text-xs">₦50,000</p>
      </div>
    </div>
  );
};
