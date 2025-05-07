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
          Cancelled
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
