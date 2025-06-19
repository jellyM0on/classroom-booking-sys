export function getUrgencyColor(urgency) {
  switch (urgency) {
    case "low":
      return "grey";
    case "medium":
      return "yellow";
    case "high":
      return "red";
    case "critical":
      return "black";
    default:
      return "grey";
  }
}
