"use client";

import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useStepper } from "@/contexts/StepperContext";
import { BreadcrumbCmp, RenderIf } from "@/components/shared";
import { Avatar, AvatarImage, Button } from "@/components/ui";
import {
  IconAudioLines,
  IconPlus,
  IconStarFull,
  IconVideo,
} from "@/components/icons";
import Link from "next/link";

export const SingleOrganisationIndividualProviderContent = () => {
  const { id } = useParams();
  const router = useRouter()
  const isLoggedIn = !!Cookies.get("authToken");
  const { setStep } = useStepper();

  const providerInfo = [
    {
      id: 1,
      title: "About",
      value:
        "Has 0 years of professional experience with 3 publications and 3 certifications",
    },
    {
      id: 2,
      title: "Special Training",
      value: "Psychotherapy (Cognitive Behavioural Therapy)",
    },
    {
      id: 3,
      title: "Diagnosis Preference",
      value: "Mood problems and emotional distress",
    },
  ];

  const services = [
    "Couple counselling",
    "Family counselling",
    "Child/Adolescent counselling",
    "Gambling addiction",
    "Sex counselling",
    "Psychological evaluation",
    "Drug & Alcohol treatment",
    "Adult individual counselling",
  ];

  const cardStats = [
    { id: 1, title: "Completed appointment", value: "152" },
    { id: 2, title: "Charge", value: "45" },
    { id: 3, title: "Communication preferences", value: ["Video", "Audio"] },
  ];

  return (
    <>
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers", href: "/providers" },
          {
            id: 2,
            name: "Leadway Health",
            href: `/providers/organisation/${id}`,
          },
          { id: 3, name: "Jide Kosoko" },
        ]}
      />

      <div className="bg-white rounded-2xl p-3 md:p-6 grid gap-y-5">
        <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
          <Avatar className="w-full md:w-39 h-39 rounded-sm">
            <AvatarImage
              className="object-cover"
              src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Avatar>

          <div className="grid gap-y-3 w-full">
            <div className="grid gap-y-1">
              <h3 className="text-xl font-bold text-brand-1">Jide Kosoko</h3>
              <p className="text-brand-2">Psychologist</p>
              <div className="flex items-center gap-x-1 text-sm text-brand-1">
                <IconStarFull className="fill-actions-amber size-5" />
                4.5
              </div>
            </div>

            <div className="border-t border-divider"></div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" className="p-0 font-semibold">
                <IconStarFull className="stroke-brand-btn-secondary size-4" />
                Mark as Favourite
              </Button>

              <RenderIf condition={isLoggedIn}>
                <Button asChild className="hidden md:inline-flex">
                  <Link href="/providers/book-appointment">
                    <IconPlus className="stroke-white" />
                    Book An Appointment
                  </Link>
                </Button>
              </RenderIf>
              <RenderIf condition={!isLoggedIn}>
                <Button
                  className="hidden md:inline-flex"
                  onClick={() => {
                    router.push('/complete-bookking')
                    setStep(2)
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
          {providerInfo.map((info) => (
            <div key={info.id} className="grid gap-y-2">
              <p className="text-sm text-brand-2">{info.title}</p>
              <p className="text-brand-1">{info.value}</p>
            </div>
          ))}
        </div>

        <div className="border border-divider rounded-lg px-4 md:px-5 py-4 grid gap-y-2">
          <p className="text-brand-2 text-sm">Services</p>

          <div className="flex gap-4 flex-wrap">
            {services.map((service) => (
              <div
                key={service}
                className="rounded-full bg-grey-400 px-4 py-2.5"
              >
                {service}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {cardStats.map((stat) => (
            <div
              key={stat.id}
              className="grid gap-2 border border-divider rounded-lg px-5 py-4"
            >
              <p className="text-brand-2 text-sm">{stat.title}</p>
              <RenderIf condition={stat.title !== "Communication preferences"}>
                <p className="text-lg text-brand-1 font-medium">{stat.value}</p>
              </RenderIf>

              <div className="flex items-center gap-x-2">
                <RenderIf
                  condition={
                    stat.title === "Communication preferences" &&
                    stat.value?.includes("Video")
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
                    stat.value?.includes("Audio")
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

        <Button className="flex md:hidden">
          <IconPlus className="stroke-white" />
          Book An Appointment
        </Button>
      </div>
    </>
  );
};
