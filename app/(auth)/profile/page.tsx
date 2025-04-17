import {
  ContactInfoDetailsSection,
  DeleteAccountSection,
  PersonalInfoDetailsSection,
  UpdatePasswordForm,
} from "@/components/custom";

const Profile = () => {
  return (
    <div className="rounded-lg md:rounded-2xl bg-white p-3 md:p-6 flex gap-x-5 w-full">
      <div className="w-full md:w-calc(100%-227px) grid gap-y-4 md:gap-y-8">
        <PersonalInfoDetailsSection />

        <ContactInfoDetailsSection />

        <div className="border border-divider rounded-lg p-4 md:py-4 md:px-6 w-full grid gap-y-5">
          <h2 className="font-bold text-text-1 text-sm md:text-base">
            Security
          </h2>

          <UpdatePasswordForm />

          <div className="border-b border-divider w-full"></div>

          <DeleteAccountSection />
        </div>
      </div>
    </div>
  );
};

export default Profile;
