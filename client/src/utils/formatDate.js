import { format } from "date-fns";

export default function formatDate(dateStr) {
  if (!dateStr) return "?";
  try {
    return format(new Date(dateStr), "MMM dd, yyyy");
  } catch {
    return "?";
  }
}
