import { CompleteProfileForm } from "@/components/custom";

const CompleteProfile = () => {
  return (
    <div className="flex items-center justify-center flex-col gap-y-8">
      <div className="text-center grid gap-y-1">
        <h2 className="text-2xl font-bold text-text-1">Complete Profile</h2>
        <p className="text-text-2 text-sm">
          Fill in your details to book sessions and enjoy a seamless experience
        </p>
      </div>

      <CompleteProfileForm />
    </div>
  );
};

export default CompleteProfile;
