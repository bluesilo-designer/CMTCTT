import { MONTH_ABBR } from "./constants";
import type { DateRange } from "./types";

export function parseMonthLabel(label: string): { year: number; month: number } {
  const [monthName, yearStr] = label.split(" ");
  const month = new Date(`${monthName} 1, 2000`).getMonth();
  return { year: parseInt(yearStr), month };
}

export function monthToKey(year: number, month: number): number {
  return year * 12 + month;
}

export function formatRange(r: DateRange): string {
  return `${MONTH_ABBR[r.fromMonth]} ${r.fromYear} — ${MONTH_ABBR[r.toMonth]} ${r.toYear}`;
}
