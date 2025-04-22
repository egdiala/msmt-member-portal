import {
  FetchOrganizationProvidersQuery,
  FetchProviderScheduleQuery,
  FetchServiceProvidersQuery,
} from "@/types/providers";
import { axiosRequestService } from "../axios-instance";

export const getServiceProviders = async (
  query: FetchServiceProvidersQuery
) => {
  const res = await axiosRequestService.post(
    "members/requests/service-providers",
    { ...query }
  );
  return res.data;
};

export const getOrganizationProviders = async (
  query: FetchOrganizationProvidersQuery
) => {
  const res = await axiosRequestService.post("members/requests/org-providers", {
    ...query,
  });
  return res.data;
};

export const getServiceIndustries = async () => {
  const res = await axiosRequestService.post(
    "members/requests/service-industries"
  );
  return res.data;
};

export const getProviderSchedule = async (
  query: FetchProviderScheduleQuery
) => {
  const res = await axiosRequestService.post(
    "members/requests/provider-schedules",
    { ...query }
  );
  return res.data;
};
