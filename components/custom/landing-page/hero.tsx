"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";
import { FilterLandingPageProvidersPopover } from "./provider";

export const Hero = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const { data: requestVariables } = useMultipleRequestVariables([
    "service-offering",
    "preferred-lan",
    "religion-list",
    "booking-prices",
  ]);

  const handleSearch = () => {
    router.push(`${pathname}?q=${search}`);
  };

  useEffect(() => {
    if (searchParams.get("q")) {
      setSearch(searchParams.get("q") as string);
    }
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
                router.push("/");
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

        <FilterLandingPageProvidersPopover
          requestVariables={requestVariables}
        />
      </div>
    </div>
  );
};
