export function getScheduleStatusColor(status) {
  switch (status) {
    case "active":
      return "green";
    case "cancelled":
      return "red";
    default:
      return "grey";
  }
}