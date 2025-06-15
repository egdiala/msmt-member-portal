"use client";

import { useEffect, useState } from "react";
import { useGetUserCountryInfo } from "@/services/hooks/queries/use-auth";
import { useGetProfile } from "@/services/hooks/queries/use-profile";

export const useGetCurrencyToDisplay = () => {
  const user = useGetProfile();
  const userCurrentCountryInfo = useGetUserCountryInfo();
  let [currency, setCurrency] = useState("");

  useEffect(() => {
    if (user?.data?.residence_country?.toLowerCase() !== "nigeria") {
      setCurrency("USD");
    } else if (user?.data?.residence_country === "") {
      if (userCurrentCountryInfo?.data?.country?.toLowerCase() !== "ng") {
        setCurrency("USD");
      } else {
        setCurrency("ngn");
      }
    } else {
      setCurrency("ngn");
    }
  }, [user, userCurrentCountryInfo]);

  return currency;
};
