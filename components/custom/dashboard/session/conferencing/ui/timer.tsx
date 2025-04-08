import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  className?: string;
}

export default function Timer({ className }: TimerProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-3 py-1 rounded-full border border-brand-accent-2 bg-white",

        className
      )}
    >
      <Clock className="w-4 h-4 md:w-5 md:h-5 text-brand-1" />
      <span className="text-sm md:text-lg text-brand-1 font-semibold">23:45</span>
    </div>
  );
}
