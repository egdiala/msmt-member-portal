import { StartSession } from "@/components/custom/dashboard/session/start-session";

export default function SessionPage() {
  const session = {
    organization: {
      name: "Tech Innovators Hub",
      type: "Educational",
    },
    provider: {
      name: "Dr. Jane Doe",
      role: "AI Researcher",
      imageUrl: "",
      date: "2025-04-10",
      time: "14:00 GMT",
      duration: "1 hour",
    },
  };
  
  return <StartSession provider={session.provider} organization={session.organization}/>;
}
