import { format, isToday } from "date-fns";

export const useFormatTableDate = (date: string) => {
  const utcDate = new Date(date);

  // Get UTC values instead of local
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();

  // Create a new "fake" Date object in local time with UTC time values
  const adjustedDate = new Date(
    utcDate.getUTCFullYear(),
    utcDate.getUTCMonth(),
    utcDate.getUTCDate(),
    utcHours,
    utcMinutes
  );

  // Format it now without timezone shifts
  const time = format(adjustedDate, "h:mmaaa").toLowerCase();
  const isTodayUTC = isToday(
    new Date(
      Date.UTC(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate()
      )
    )
  );

  return isTodayUTC
    ? `Today • ${time}`
    : `${format(adjustedDate, "MMM d")} • ${time}`;
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
