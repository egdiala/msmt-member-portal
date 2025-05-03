"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import { FilterLandingPageProvidersPopover } from "./provider";
import { RenderIf } from "@/components/shared";

export const Hero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const { data: requestVariables } = useMultipleRequestVariables([
    "service-offering",
    "preferred-lan",
    "religion-list",
    "booking-prices",
  ]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", search);
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    if (searchParams.get("q")) {
      setSearch(searchParams.get("q") as string);
    }
  }, [searchParams]);

  const [searchParamsArrLength, setSearchParamsArrLength] = useState(0);

  useEffect(() => {
    setSearchParamsArrLength(Array.from(searchParams.entries()).length);
  }, [searchParams]);

  return (
    <div className="py-15 md:py-25 px-5 grid gap-y-6 bg-blue-400 w-full">
      <div className="grid gap-y-1 text-center">
        <h2 className="font-bold text-3xl md:text-5xl text-brand-1">
          Find a Provider
        </h2>

        <p className="text-sm text-brand-2">
          Find expert support, schedule sessions, or grow your practice. Sign up
          in minutes.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center gap-y-8 w-full">
        <div className="w-full lg:w-4xl max-w-4xl relative">
          <Input
            value={search}
            onChange={(e) => {
              if (e.target.value === "") {
                setSearch("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("q");
                router.push(`?${params.toString()}`);
              } else {
                setSearch(e.target.value);
              }
            }}
            className="w-full bg-white shadow-modal-button-landing rounded-full pr-23 placeholder:text-brand-2"
            placeholder="Search service, email, provider name, etc"
          />
          <div className="absolute right-2 top-2">
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <FilterLandingPageProvidersPopover
            requestVariables={requestVariables}
          />

          <RenderIf condition={searchParamsArrLength > 0}>
            <Button
              variant="ghost"
              className="underline text-button-primary"
              onClick={() => {
                router.push("/");
              }}
            >
              Clear all filters
            </Button>
          </RenderIf>
        </div>
      </div>
    </div>
  );
};
