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
    default:
      return status;
  }
}

export function getStatusBadgeId(status: string) {
  switch (status) {
    case "Upcoming":
      return (
        <div className="bg-[#0073C4] font-medium text-xs md:text-sm !py-0.5 !px-2 text-white rounded-xs">
          Upcoming
        </div>
      );
    case "Completed":
    case "Live":
      return (
        <div className="bg-[#0AA571] font-medium text-xs md:text-sm text-white !py-0.5 !px-2 rounded-xs">
          Completed
        </div>
      );
    case "Canceled":
      return (
        <div className="!bg-[#DD2418] font-medium text-xs md:text-sm  text-white !py-0.5 !px-2 rounded-xs">
          Canceled
        </div>
      );
    case "Pending":
      return (
        <div className="bg-yellow-400 font-medium text-xs md:text-sm text-white !py-0.5 !px-2 rounded-xs">
          Pending
        </div>
      );
    default:
      return status;
  }
}
