import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  getOrganizationProviders,
  getProviderSchedule,
  getServiceIndustries,
  getServiceProviders,
} from "@/services/api/providers";
import {
  FetchOrganizationProvidersQuery,
  FetchServiceProvidersQuery,
} from "@/types/providers";

export const useGetServiceProviders = <T>(
  query: FetchServiceProvidersQuery
) => {
  return useQuery({
    queryKey: ["get-service-providers", query],
    queryFn: () => getServiceProviders(query),
    select: (res) => res?.data as T,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};

export const useGetOrganizationProviders = <T>(
  query: FetchOrganizationProvidersQuery
) => {
  return useQuery({
    queryKey: ["get-organization-providers", query],
    queryFn: () => getOrganizationProviders(query),
    select: (res) => res?.data as T,
    retry: false,
    enabled: !!query.org_id,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};

export const useGetServiceIndustries = () => {
  return useQuery({
    queryKey: ["get-service-industries"],
    queryFn: () => getServiceIndustries(),
    select: (res) => res?.data,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};

export const useGetProviderSchedule = <T>(
  query: FetchOrganizationProvidersQuery
) => {
  return useQuery({
    queryKey: ["get-provider-schedule", query],
    queryFn: () => getProviderSchedule(query),
    select: (res) => res?.data as T,
    retry: false,
    throwOnError(error: any) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
      return false;
    },
  });
};
