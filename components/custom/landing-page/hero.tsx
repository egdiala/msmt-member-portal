import { IconFilter } from "@/components/icons";
import { Button, Input } from "@/components/ui";

export const Hero = () => {
  return (
    <div className="py-25 px-5 grid gap-y-6 bg-blue-400 w-full">
      <div className="grid gap-y-1 text-center">
        <h2 className="font-bold text-3xl md:text-5xl text-brand-1">
          Find a Provider
        </h2>

        <p className="text-sm text-brand-2">
          Find expert support, schedule sessions, or grow your practice. Sign up
          in minutes.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center gap-y-8 w-full">
        <div className="w-full md:w-200 max-w-200 relative">
          <Input className="w-full bg-white shadow-modal-button-landing rounded-full pr-23" />
          <div className="absolute right-2 top-2">
            <Button>Search</Button>
          </div>
        </div>

        <Button className="!px-3 !py-5">
          <IconFilter className="stroke-white" />
        </Button>
      </div>
    </div>
  );
};
