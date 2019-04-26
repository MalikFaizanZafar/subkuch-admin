/**
 * Placement of the datepicker
 */
export enum IsTimePickerPlacement {
  Top = <any> 'top',
  Bottom = <any> 'bottom'
}

/**
 * This class represents the current state of the datepicker
 */
export class IsTimePickerState {

  /**
   * Whether or not the input is focused
   */
  inputFocused = false;

  /**
   * Hours set on the date
   */
  hours = '';

  /**
   * Whether or not the hours segment is focused
   */
  hoursFocused: false;

  /**
   * Date meridian
   */
  meridian: IsTimePickerMeridian | null | '' = null;

  /**
   * Whether or not the meridian segment is focused.
   */
  meridianFocused = false;

  /**
   * Minutes set on the date
   */
  minutes = '';

  /**
   * Whether or not the minutes segment is focused
   */
  minutesFocused = false;

  /**
   * Whether the current date's meridian is AM
   */
  isMeridiamAM(): boolean {
    return this.meridian === IsTimePickerMeridian.AM;
  }

  /**
   * Whether the current date's meridian is PM
   */
  isMeridiamPM(): boolean {
    return this.meridian === IsTimePickerMeridian.PM;
  }
}

/**
 * Date meridian
 */
export enum IsTimePickerMeridian {
  AM = <any> 'AM',
  PM = <any> 'PM'
}
