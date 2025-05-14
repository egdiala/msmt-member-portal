import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { RequestVariableComponent, UserProfileType } from "@/types/profile";
import { getProfile, getRequestsVariables } from "@/services/api/profile";
import type { QueryResponseType } from "@/types/utils";

export const useGetProfile = (config?: any) => {
  return useQuery<QueryResponseType<UserProfileType>, Error, UserProfileType>({
    queryKey: ["get-profile"],
    queryFn: getProfile,
    select: (res) => {
      return res.data;
    },
    ...config
  });
};

export const useMultipleRequestVariables = (
  components: RequestVariableComponent[]
) => {
  const queries = useQueries({
    queries: components.map((component) => ({
      queryKey: ["request-variables", component],
      queryFn: () => getRequestsVariables(component),
      select: (response: any) => response.data,
    })),
  });

  const data = useMemo(() => {
    return components.reduce((acc, component, index) => {
      acc[component] = queries[index].data;
      return acc;
    }, {} as Record<string, any>);
  }, [queries, components]);

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);

  return { data, isLoading, isError };
};
