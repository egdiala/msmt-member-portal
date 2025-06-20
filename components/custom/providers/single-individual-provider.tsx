"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { differenceInYears } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  IconAudioLines,
  IconPlus,
  IconStarFull,
  IconVideo,
} from "@/components/icons";
import { BreadcrumbCmp, RenderIf } from "@/components/shared";
import { Avatar, AvatarImage, Button } from "@/components/ui";
import { useStepper } from "@/contexts/StepperContext";
import { Loader } from "@/components/shared/loader";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { cn } from "@/lib/utils";
import { useGetServiceProviders } from "@/services/hooks/queries/use-providers";
import {
  useAddFavouriteProvider,
  useRemoveFavouriteProvider,
} from "@/services/hooks/mutations/use-providers";
import { useGetProfile } from "@/services/hooks/queries/use-profile";
import { FetchSingleProvider } from "@/types/providers";
import { UserProfileType } from "@/types/profile";

export const SingleIndividualProviderContent = () => {
  const { id } = useParams();
  const router = useRouter();
  const { setStep } = useStepper();
  const isLoggedIn = !!Cookies.get("authToken");
  const searchParams = useSearchParams();
  const { data: userProfile } = useGetProfile();
  const [user, setUser] = useState<UserProfileType>();

  useEffect(() => {
    if (window !== undefined) {
      setUser(JSON.parse(localStorage.getItem("user") as string));
    }
  }, []);

  const user_type = searchParams.get("type") as "provider" | "org";
  const account_service_type = searchParams.get("service_type") as
    | "provider"
    | "payer";

  const { data, isLoading } = useGetServiceProviders<FetchSingleProvider>({
    user_id: id?.toString(),
    user_type: user_type,
    account_service_type: account_service_type,
    member_id: userProfile?.user_id,
    residence_country: user?.residence_country,
  });

  const yearsOfExperience = differenceInYears(
    new Date(),
    new Date(data?.service_start_year ?? 0)
  );

  const providerInfo = [
    {
      id: 1,
      title: "About",
      value: `Has ${
        data?.service_start_year === 0 ? 0 : yearsOfExperience
      } years of professional experience with ${
        data?.total_publication ?? 0
      } publications and ${data?.total_certification ?? 0} certifications`,
    },
    {
      id: 2,
      title: "Special Training",
      value: data?.special_training_data?.map((item) => item.name).join(", "),
    },
  ];

  const cardStats = [
    {
      id: 1,
      title: "Completed appointment",
      value: data?.completed_appointment ?? "",
    },
    {
      id: 2,
      title: "Charge",
      value: formatNumberWithCommas(data?.charge_from ?? 0),
    },
    { id: 3, title: "Communication preferences", value: data?.comm_mode ?? [] },
  ];

  const { mutate: addFavourite, isPending } = useAddFavouriteProvider();
  const { mutate: removeFavourite, isPending: isRemovingFavourite } =
    useRemoveFavouriteProvider();

  const handleMarkAsFavourite = () => {
    if (data?.isfav_provider) {
      removeFavourite(id!.toString());
    } else {
      addFavourite(id!.toString());
    }
  };

  const buttonCopy = {
    idle: (
      <div className="flex items-center justify-between gap-x-2 px-3 py-2">
        <IconStarFull className="size-4" />
        <p>
          {data?.isfav_provider ? "Remove from Favourite" : "Mark as Favourite"}
        </p>
      </div>
    ),
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isRemovingFavourite ? "loading" : "idle";
  }, [isPending, isRemovingFavourite]);

  return (
    <>
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers" },
          { id: 2, name: data?.name ?? "" },
        ]}
      />

      <div className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-5">
        <RenderIf condition={isLoading}>
          <div className="h-screen w-full flex justify-center items-center">
            <Loader />
          </div>
        </RenderIf>

        <RenderIf condition={!isLoading}>
          <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
            <Avatar className="w-full md:w-39 h-39 rounded-sm">
              <AvatarImage
                className="object-cover rounded-sm"
                src={data?.avatar || "/assets/blank-profile-picture.png"}
              />
            </Avatar>

            <div className="grid gap-y-3 w-full">
              <div className="grid gap-y-1 capitalize">
                <h3 className="text-xl font-bold text-brand-1">{data?.name}</h3>
                <p className="text-brand-2 capitalize">{data?.specialty}</p>
                <div className="flex items-center gap-x-1 text-sm text-brand-1">
                  <IconStarFull className="fill-actions-amber size-5" />
                  {data?.rating?.toFixed(1)}
                </div>
              </div>

              <div className="border-t border-divider"></div>

              <div className="flex items-center justify-between">
                <Button
                  variant={data?.isfav_provider ? "default" : "ghost"}
                  className={cn(
                    "p-0 font-semibold min-w-42",
                    data?.isfav_provider
                      ? "stroke-white"
                      : "stroke-brand-btn-secondary hover:stroke-white"
                  )}
                  disabled={isPending || isRemovingFavourite}
                  onClick={handleMarkAsFavourite}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      initial={{ opacity: 0, y: -25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 25 }}
                      key={buttonState}
                    >
                      {buttonCopy[buttonState]}
                    </motion.span>
                  </AnimatePresence>
                </Button>

                <RenderIf condition={isLoggedIn}>
                  <Button asChild className="hidden md:inline-flex">
                    <Link
                      href={`/providers/book-appointment?provider_id=${id}&type=${user_type}&service_type=${account_service_type}`}
                    >
                      <IconPlus className="stroke-white" />
                      Book An Appointment
                    </Link>
                  </Button>
                </RenderIf>
                <RenderIf condition={!isLoggedIn}>
                  <Button
                    className="hidden md:inline-flex"
                    onClick={() => {
                      router.push(
                        `/complete-booking?provider_id=${id}&type=${user_type}&service_type=${account_service_type}`
                      );
                      setStep(2);
                    }}
                  >
                    <IconPlus className="stroke-white" />
                    Book An Appointment
                  </Button>
                </RenderIf>
              </div>
            </div>
          </div>

          <div className="border border-divider rounded-lg px-5 py-4 grid gap-y-5">
            {providerInfo?.map((info) => (
              <div key={info.id} className="grid gap-y-2">
                <p className="text-sm text-brand-2">{info.title}</p>
                <p className="text-brand-1">{info.value}</p>
              </div>
            ))}
          </div>

          <div className="border border-divider rounded-lg px-4 md:px-5 py-4 grid gap-y-2">
            <p className="text-brand-2 text-sm">Services</p>

            <div className="flex gap-4 flex-wrap">
              {data?.service_data?.map((service) => (
                <div
                  key={service?.service_offer_id}
                  className="rounded-full bg-grey-400 px-4 py-2.5 capitalize"
                >
                  {service?.name}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {cardStats?.map((stat) => (
              <div
                key={stat.id}
                className="grid gap-2 border border-divider rounded-lg px-5 py-4"
              >
                <p className="text-brand-2 text-sm">{stat.title}</p>
                <RenderIf
                  condition={stat.title !== "Communication preferences"}
                >
                  <p className="text-lg text-brand-1 font-medium">
                    {stat.value}
                  </p>
                </RenderIf>

                <div className="flex items-center gap-x-2">
                  <RenderIf
                    condition={
                      stat.title === "Communication preferences" &&
                      [stat?.value]?.flat()?.includes("video")
                    }
                  >
                    <Button
                      variant="outline"
                      className="border-button-primary bg-blue-400 w-fit text-button-primary hover:text-button-primary"
                    >
                      <IconVideo className="stroke-button-primary" />
                      Video
                    </Button>
                  </RenderIf>

                  <RenderIf
                    condition={
                      stat.title === "Communication preferences" &&
                      [stat.value]?.flat()?.includes("audio")
                    }
                  >
                    <Button
                      variant="outline"
                      className="border-button-primary bg-blue-400 w-fit text-button-primary hover:text-button-primary"
                    >
                      <IconAudioLines className="stroke-button-primary" />
                      Audio
                    </Button>
                  </RenderIf>
                </div>
              </div>
            ))}
          </div>

          <RenderIf condition={isLoggedIn}>
            <Button asChild className="flex md:hidden">
              <Link
                href={`/providers/book-appointment?provider_id=${id}&type=${user_type}&service_type=${account_service_type}`}
              >
                <IconPlus className="stroke-white" />
                Book An Appointment
              </Link>
            </Button>
          </RenderIf>
        </RenderIf>
        <RenderIf condition={!isLoggedIn}>
          <Button
            className="flex md:hidden"
            onClick={() => {
              router.push(
                `/complete-booking?provider_id=${id}&type=${user_type}&service_type=${account_service_type}`
              );
              setStep(2);
            }}
          >
            <IconPlus className="stroke-white" />
            Book An Appointment
          </Button>
        </RenderIf>
      </div>
    </>
  );
};
