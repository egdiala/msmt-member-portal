"use client";

import { useRouter } from "next/navigation";
import { IconCamera } from "@/components/icons";
import { Button } from "@/components/ui";
import { CompleteProfileForm } from "@/components/shared";
import { DASHBOARD } from "@/lib/routes";

const CompleteProfile = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center flex-col gap-y-8">
      <div className="text-center grid gap-y-1">
        <h2 className="text-2xl font-bold text-text-1">Complete Profile</h2>
        <p className="text-text-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <div className="grid gap-y-5 w-full md:justify-center">
        <div className="flex items-center justify-center flex-col">
          <div className="border border-text-tertiary rounded-full size-[100px] bg-white"></div>

          <Button
            variant="ghost"
            className="p-0 gap-x-1 underline text-button-primary font-medium tracking-[-2%] cursor-pointer"
          >
            <IconCamera className="stroke-text-tertiary size-4" />
            Upload Profile Picture
          </Button>
        </div>

        <CompleteProfileForm />
      </div>

      <div className="flex justify-center gap-8 flex-col-reverse md:flex-row w-full md:w-fit">
        <Button variant="secondary" onClick={() => router.push(DASHBOARD)}>
          Cancel
        </Button>
        <Button>Complete Profile</Button>
      </div>
    </div>
  );
};

export default CompleteProfile;
