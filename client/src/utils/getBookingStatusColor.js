export function getBookingStatusColor(status) {
  switch (status) {
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      return "grey";
  }
}