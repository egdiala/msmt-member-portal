import { MeetingContainer } from "@/components/custom/dashboard/session/conferencing";
import { MeetingProvider } from "@/contexts/MeetingContext";
export default function MeetingPage() {
  return (
    <MeetingProvider>
      <MeetingContainer />
    </MeetingProvider>
  );
}
