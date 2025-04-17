import { format, isToday, parseISO } from "date-fns";

export const formatTableDate = (date: string) => {
  const parsedDate = parseISO(date); // parse the ISO string

  let formattedDate;

  if (isToday(parsedDate)) {
    formattedDate = `Today • ${format(parsedDate, "h:mmaaa")}`;
  } else {
    formattedDate = format(parsedDate, "MMM d • h:mmaaa"); // fallback format
  }

  return formattedDate;
};

export const useGetTableTotalPages = ({
  totalDataCount,
  itemsPerPage,
}: {
  totalDataCount: number;
  itemsPerPage: number;
}) => {
  if (totalDataCount <= itemsPerPage) {
    return "1";
  } else {
    const value = Math.floor(totalDataCount / itemsPerPage);

    if (totalDataCount % itemsPerPage > 0) {
      return (value + 1).toString();
    } else {
      return value.toString();
    }
  }
};
