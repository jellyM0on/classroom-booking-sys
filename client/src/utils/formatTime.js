import { format } from "date-fns";

export default function formatTime(timeStr) {
  if (!timeStr) return "?";
  try {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes));
    return format(date, "hh:mm a");
  } catch {
    return "?";
  }
}
