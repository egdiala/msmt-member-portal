import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui";
import ImgBkg from "@/components/assets/img-bkg-landing.png";
import { MAIN_SECTION_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SectionContainer = ({
  color,
  header,
  description1,
  description2,
  bgImg,
  img,
  isSecondImg,
  isFirstImg,
}: {
  color: string;
  header: string;
  description1: string;
  description2: string;
  bgImg: string;
  img: StaticImageData;
  isSecondImg?: boolean;
  isFirstImg?: boolean;
}) => {
  return (
    <div
      className={`w-full flex flex-col md:flex-row rounded-2xl ${color} bg-no-repeat bg-cover bg-[url(${bgImg})]`}
    >
      <div className="py-5 md:py-12 pl px-5 md:pl-12 md:pr-0 grid gap-y-6 basis-1/2">
        <div className="grid gap-y-2 text-brand-1">
          <h3 className="text-xl md:text-2xl font-bold">{header}</h3>
          <p className="text-base md:text-lg">{description1}</p>
          <p className="text-base md:text-lg">{description2}</p>
        </div>

        <div className="flex items-center gap-x-2">
          <Button asChild>
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <Button variant="secondary" className="!bg-inherit shadow-none">
            <Link href="/sign-in">Log in</Link>
          </Button>
        </div>
      </div>

      <div className="relative hidden md:flex basis-1/2 overflow-hidden">
        <Image
          src={ImgBkg}
          alt="bkg img"
          className={cn(
            "absolute ",
            !isFirstImg && !isSecondImg
              ? "top-9 right-1 bottom-0"
              : isSecondImg
              ? "top-9 right-3 bottom-2"
              : "top-5 right-1 bottom-0"
          )}
          width={377}
          height={377}
        />

        <Image
          src={img}
          alt="user img"
          className={cn(
            "object-cover absolute",
            isFirstImg
              ? "top-2 -right-1 bottom-0"
              : isSecondImg
              ? "right-3 bottom-2 rounded-tr-[60px] rounded-bl-[45px]"
              : "right-0 bottom-0"
          )}
        />
      </div>
    </div>
  );
};

export const MainLanding = () => {
  return (
    <div className="py-10 md:py-25 flex flex-col justify-center items-center gap-y-12 max-w-screen-2xl mx-auto">
      <div className="max-w-2xl text-center grid gap-y-2 px-5">
        <h2 className="font-bold text-3xl md:text-4xl text-brand-1">
          Your Path to Immediate, Trusted Mental Health Care
        </h2>
        <p className="text-lg">
          MSMT connects you with experienced professionals through a secure,
          easy-to-use platform.
        </p>
      </div>

      <div className="max-w-4xl grid gap-y-7 px-5">
        {MAIN_SECTION_INFO.map((info, index) => (
          <SectionContainer
            key={info.id}
            color={info.color}
            header={info.header}
            description1={info.description1}
            description2={info.description2}
            bgImg={info.bgImg}
            img={info.img}
            isSecondImg={index === 1}
            isFirstImg={index === 0}
          />
        ))}
      </div>
    </div>
  );
};
