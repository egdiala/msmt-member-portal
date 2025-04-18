'use client'
import { CompleteProfileForm } from "@/components/custom";
import { useGetProfile } from "@/services/hooks/queries/use-profile";

const CompleteProfile = () => {
  const { data } = useGetProfile();

  return (
    <div className="flex items-center justify-center flex-col gap-y-8">
      <div className="text-center grid gap-y-1">
        <h2 className="text-2xl font-bold text-text-1">Complete Profile</h2>
        <p className="text-text-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <CompleteProfileForm data={data!} key={data ? "5" : "Loaded5"} />
    </div>
  );
};

export default CompleteProfile;
