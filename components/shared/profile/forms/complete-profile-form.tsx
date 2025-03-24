import { Input } from "@/components/ui";
import { SelectCmp } from "../..";

export const CompleteProfileForm = () => {
  return (
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
  );
};
