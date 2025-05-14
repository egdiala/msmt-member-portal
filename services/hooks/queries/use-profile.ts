import { useQuery, useQueries, UndefinedInitialDataOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { RequestVariableComponent, UserProfileType } from "@/types/profile";
import { getProfile, getRequestsVariables } from "@/services/api/profile";

export const useGetProfile = (config?: Partial<UndefinedInitialDataOptions<any, Error, UserProfileType, string[]>>) => {
  return useQuery({
    queryKey: ["get-profile"],
    queryFn: getProfile,
    select: (res) => res.data as UserProfileType,
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
