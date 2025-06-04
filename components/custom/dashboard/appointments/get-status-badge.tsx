export function getStatusBadge(status: string) {
  switch (status) {
    case "Upcoming":
      return (
        <span className="text-[#0073C4] font-medium text-xs md:text-sm">
          Upcoming
        </span>
      );
    case "Completed":
      return (
        <span className="text-[#0AA571] font-medium text-xs md:text-sm">
          Completed
        </span>
      );
    case "Canceled":
      return (
        <span className="text-[#DD2418] font-medium text-xs md:text-sm">
          Canceled
        </span>
      );
    case "Pending":
      return (
        <span className="text-yellow-400 font-medium text-xs md:text-sm">
          Pending
        </span>
      );
    case "Live":
      return (
        <span className="text-purple-500 font-medium text-xs md:text-sm">
          Live
        </span>
      );
    default:
      return status;
  }
}

export function getStatusBadgeId(status: string) {
  switch (status) {
    case "Upcoming":
      return (
        <span className="bg-[#0073C4] font-medium w-fit text-xs md:text-sm !py-1 !px-2 text-white rounded-xs">
          Upcoming
        </span>
      );
    case "Completed":
    case "Live":
      return (
        <span className="bg-[#0AA571] font-medium w-fit text-xs md:text-sm text-white !py-1 !px-2 rounded-xs">
          Completed
        </span>
      );
    case "Canceled":
      return (
        <span className="!bg-[#DD2418] font-medium w-fit text-xs md:text-sm  text-white !py-1 !px-2 rounded-xs">
          Canceled
        </span>
      );
    case "Pending":
      return (
        <span className="bg-yellow-400 font-medium w-fit text-xs md:text-sm text-white !py-1 !px-2 rounded-xs">
          Pending
        </span>
      );
    default:
      return status;
  }
}
