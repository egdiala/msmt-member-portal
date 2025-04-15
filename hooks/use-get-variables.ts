import { useMultipleRequestVariables } from "@/services/hooks/queries/use-profile";

export const useGetDefinedVariables = () => {
  const { data: requestVariables } = useMultipleRequestVariables([
    "religion-list",
    "marital-status",
    "country-list",
    "preferred-lan",
  ]);

  const variableList = (requestVariable: string[]) => {
    return requestVariable?.map((item: string, index: number) => ({
      value: item,
      id: index,
    }));
  };

  const countryList = requestVariables?.["country-list"]?.map(
    (item: { name: string }, index: number) => ({
      value: item?.name,
      id: index,
    })
  );

  return {
    requestVariables,
    variableList,
    countryList,
  };
};
