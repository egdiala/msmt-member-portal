import { Button } from "@/components/ui";
import { MAIN_SECTION_INFO } from "@/lib/constants";

const SectionContainer = ({
  color,
  header,
  description,
  bgImg,
}: {
  color: string;
  header: string;
  description: string;
  bgImg: string;
}) => {
  return (
    <div
      className={`w-full flex rounded-2xl ${color} bg-no-repeat bg-cover bg-[url(${bgImg})]`}
    >
      <div className="py-12 pl-12 grid gap-y-6 basis-1/2">
        <div className="grid gap-y-2">
          <h3 className="text-2xl font-bold text-brand-1">{header}</h3>
          <p>{description}</p>
        </div>

        <div className="flex items-center gap-x-2">
          <Button>Sign up</Button>
          <Button variant="secondary" className="!bg-inherit shadow-none">
            Log in
          </Button>
        </div>
      </div>

      <div></div>
    </div>
  );
};

export const MainLanding = () => {
  return (
    <div className="py-25 flex flex-col justify-center items-center gap-y-12">
      <div className="max-w-xl text-center grid gap-y-2">
        <h2 className="font-bold text-4xl text-brand-1">
          Your Path to Immediate, Trusted Mental Health Care
        </h2>
        <p className="text-lg">
          MSMT connects you with experienced professionals through a secure,
          easy-to-use platform.
        </p>
      </div>

      <div className="max-w-4xl grid gap-y-7">
        {MAIN_SECTION_INFO.map((info) => (
          <SectionContainer
            key={info.id}
            color={info.color}
            header={info.header}
            description={`${info.description1} \n${info.description2}`}
            bgImg={info.bgImg}
          />
        ))}
      </div>
    </div>
  );
};
