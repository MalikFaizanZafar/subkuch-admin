// Custom internal date representation
export interface IsDate {
  isToday: boolean;
  isPast: boolean;
  day: number;
  month: number;
  year: number;
}

export class IsCalendarUtils {
  static getJulianDay(day: number, month: number, year: number) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }
}

export enum IsDatePickerPlacement {
  Top = <any> 'top',
  Bottom = <any> 'bottom'
}

export enum IsDatePickerDirection {
  FutureOnly = <any> 1,
  PastOnly = <any> -1,
  NoRestriction = <any> 0,
  FutureWithToday = <any> 2,
  PastWithToday = <any> -2
}

export type IsDateFormatFunction = (date: Date) => string;

/**
 * String to date formatter function, should return null if
 * text couldn't be converted to a valid date
 */
export type IsDatepickerStringToDateFormatter = (text: string, format?: string) => Date | null;
