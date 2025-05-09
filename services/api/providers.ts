import { createQueryString } from "@/lib/utils";
import {
  FetchFavouriteProvidersQuery,
  FetchOrganizationProvidersQuery,
  FetchProviderScheduleQuery,
  FetchServiceProvidersQuery,
} from "@/types/providers";
import { axiosRequestService, axiosUserService } from "../axios-instance";

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

export const getFavouriteProviders = async (
  query: FetchFavouriteProvidersQuery
) => {
  const res = await axiosUserService.get(
    `members/accounts/fav-providers${createQueryString(query)}`
  );
  return res.data;
};

export const addFavouriteProvider = async (provider_id: string) => {
  const res = await axiosUserService.post("members/accounts/fav-providers", {
    provider_id,
  });
  return res.data;
};

export const removeFavouriteProvider = async (provider_id: string) => {
  const res = await axiosUserService.delete(
    `members/accounts/fav-providers/${provider_id}`
  );
  return res.data;
};


