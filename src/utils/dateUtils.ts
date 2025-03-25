import { format } from "date-fns";

export function dateStringToddmmyyyy(timestampStr: string): string {
  return format(new Date(parseInt(timestampStr, 10)), "dd/MM/yyyy");
}
