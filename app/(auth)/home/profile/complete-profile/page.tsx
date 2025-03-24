import { IconCamera } from "@/components/icons";
import { SelectCmp } from "@/components/shared";
import { Button, Input } from "@/components/ui";

const CompleteProfile = () => {
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

        <form className="bg-white rounded-2xl p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4 w-full md:w-[650px]">
          <Input
            placeholder="Preferred Name"
            className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
          />
          <Input
            placeholder="Phone Number"
            className="h-[50px] bg-input-field px-2 py-[15px] border-none outline-none focus-visible:ring-offset-0 focus-visible:ring-0 shadow-none"
          />
          <SelectCmp selectItems={[]} placeholder={"Religion"} />
          <SelectCmp selectItems={[]} placeholder={"Gender"} />
          <SelectCmp selectItems={[]} placeholder={"Marital Status"} />
          <SelectCmp selectItems={[]} placeholder={"Country"} />
          <SelectCmp selectItems={[]} placeholder={"Preferred Language"} />
        </form>
      </div>

      <div className="flex justify-center gap-8 flex-col-reverse md:flex-row w-full md:w-fit">
        <Button
          variant="secondary"
          className="bg-blue-400 rounded-[100px] font-semibold text-sm cursor-pointer shadow-none w-full"
        >
          Cancel
        </Button>
        <Button className="bg-button-primary text-white rounded-[100px] font-semibold text-sm cursor-pointer shadow-none w-full">
          Complete Profile
        </Button>
      </div>
    </div>
  );
};

export default CompleteProfile;
