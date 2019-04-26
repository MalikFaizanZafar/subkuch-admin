import { IsTimePickerMeridian } from './timepicker.model';

export class IsTimePickerHelper {
  /**
   * Transform 24 hour format to 12 hour format.
   * @param hours in 24 hour format.
   */
  static formatHours12(hours: number) {
    if (hours === 0) {
      return 12;
    } else if (hours > 12) {
      return hours - 12;
    } else {
      return hours;
    }
  }

  /**
   * Transform the hours from 12 format to 24 format.
   * @param hours in 12 format.
   * @param meridian AM or PM.
   */
  static formatHours24(hours: string, meridian: string): number {
    const hour = Number(hours);
    if (meridian === 'PM') {
      return (hour < 12) ? Number(hours) + 12 : 12;
    } else {
      return (hour === 12) ? 0 : Number(hours);
    }
  }

  /**
   * Decides if meridian is AM or PM.
   * @param hours in 24 hour format.
   */
  static formatMeridian(hours: number) {
    return (hours > 11) ? IsTimePickerMeridian.PM : IsTimePickerMeridian.AM;
  }

  /**
   * Formats a number to a two digit string.
   * @param number to format.
   */
  static formatNumber(number: number): string {
    return (number < 10) ? `0${number}` : String(number);
  }
}
