"use client";

import { useState } from "react";
import { IconList, IconList2, IconStarFull } from "@/components/icons";
import {
  BreadcrumbCmp,
  PaginationCmp,
  RenderIf,
  Searchbar,
  TableCmp,
} from "@/components/shared";
import { Avatar, AvatarImage, Button } from "@/components/ui";
import { SingleProviderCard } from "@/components/custom";
import { PROVIDERS_UNDER_ORGANISATION_LIST } from "@/lib/mock";
import { PROVIDERS_TABLE_HEADERS } from "@/lib/constants";

const SingleOrganisationProvider = () => {
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
    { id: 2, title: "Providers", value: "21" },
  ];

  const [showGridView, setShowGridView] = useState(true);

  const tableData = PROVIDERS_UNDER_ORGANISATION_LIST.map((provider) => {
    return {
      id: provider.id,
      date_and_time: (
        <p className="text-brand-2">
          {provider.date} • {provider.time}
        </p>
      ),
      name: <p className="capitalize">{provider.name}</p>,
      specialty: <p className="capitalize">{provider.title}</p>,
      rating: provider.rating,
      type: <p className="capitalize">{provider.type}</p>,
      charge_from: <p className="capitalize">{provider.rate}</p>,
    };
  });

  return (
    <div className="grid gap-y-4">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers", href: "/providers" },
          { id: 2, name: "Leadway Health" },
        ]}
      />
      <div className="bg-white rounded-2xl p-3 md:p-4 grid gap-y-5">
        <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
          <Avatar className="w-full md:w-39 h-39 rounded-sm">
            <AvatarImage
              className="object-cover"
              src="https://images.unsplash.com/photo-1496200186974-4293800e2c20?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Avatar>

          <div className="grid gap-y-3 w-full">
            <div className="grid gap-y-1">
              <h3 className="text-xl font-bold text-brand-1">Leadway Health</h3>
              <p className="text-brand-2">Clinic</p>
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
            </div>
          </div>
        </div>

        <div className="border border-divider rounded-lg px-4 md:px-5 py-4 grid gap-y-5">
          {providerInfo.map((info) => (
            <div key={info.id} className="grid gap-y-2">
              <p className="text-sm text-brand-2">{info.title}</p>
              <p className="text-brand-1">{info.value}</p>
            </div>
          ))}
        </div>

        <div className="border border-divider rounded-lg px-3 md:px-5 py-4 grid gap-y-2">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cardStats.map((stat) => (
            <div
              key={stat.id}
              className="grid gap-2 border border-divider rounded-lg px-5 py-4"
            >
              <p className="text-brand-2 text-sm">{stat.title}</p>
              <p className="text-lg text-brand-1 font-medium">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white w-full rounded-2xl p-4 md:p-6 grid gap-y-4 md:gap-y-5">
        <RenderIf condition={showGridView}>
          <h3 className="font-bold text-brand-1">Providers</h3>
        </RenderIf>

        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center justify-between">
          <Searchbar value="" onChange={() => {}} placeholder="Search" />

          <Button
            variant="outline"
            className="hidden md:inline-flex w-fit h-fit py-2 px-3 rounded-2xl"
            onClick={() => setShowGridView(!showGridView)}
          >
            <RenderIf condition={showGridView}>
              <IconList2 className="stroke-brand-btn-secondary size-4" />
            </RenderIf>

            <RenderIf condition={!showGridView}>
              <IconList className="stroke-brand-btn-secondary size-4" />
            </RenderIf>
          </Button>
        </div>

        <RenderIf condition={!showGridView}>
          <TableCmp data={tableData} headers={PROVIDERS_TABLE_HEADERS} />

          <div className="grid md:hidden gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {PROVIDERS_UNDER_ORGANISATION_LIST.map((provider) => (
              <SingleProviderCard
                key={provider.id}
                isOrganisation
                {...provider}
              />
            ))}
          </div>
        </RenderIf>

        <RenderIf condition={showGridView}>
          <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {PROVIDERS_UNDER_ORGANISATION_LIST.map((provider) => (
              <SingleProviderCard
                key={provider.id}
                isOrganisation
                {...provider}
              />
            ))}
          </div>
        </RenderIf>

        <PaginationCmp
          onInputPage={() => {}}
          currentPage={"1"}
          totalPages={"30"}
        />
      </div>
    </div>
  );
};

export default SingleOrganisationProvider;
