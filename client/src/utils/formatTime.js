import { format } from "date-fns";

export default function formatTime(input) {
  if (!input) return "?";

  try {
    const date =
      typeof input === "string"
        ? new Date(`1970-01-01T${input}`)
        : new Date(input);

    if (isNaN(date.getTime())) throw new Error("Invalid date");

    return format(date, "hh:mm a");
  } catch {
    return "?";
  }
}
