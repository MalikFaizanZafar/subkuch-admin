import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { format, startOfMonth } from 'date-fns';

import {
  IsCalendarUtils,
  IsDate,
  IsDatePickerDirection,
  IsDatePickerPlacement,
  IsDateFormatFunction,
  IsDatepickerStringToDateFormatter
} from './datepicker.models';
import { datePickerFadeInOut } from './datepicker.animation';
import * as dateConst from './datepicker.const';
import { ConnectionPositionPair, ScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { POSITION_PAIRS } from '../core/shared/constants/position-pairs';

const isDatepickerValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsDatepicker),
  multi: true
};

const DF_DATEPICKER_INVALID_MESSAGE = 'Invalid Date';

@Component({
  selector: 'is-datepicker',
  templateUrl: './datepicker.html',
  styleUrls: ['./datepicker.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [datePickerFadeInOut],
  providers: [isDatepickerValueAccessor],
  host: { 'class': 'is-datepicker__container' }
})
export class IsDatepicker implements OnInit, ControlValueAccessor {

  /**
   * Array of days to be rendered on the calendar
   */
  days: IsDate[];

  /**
   * Represents the date for today
   */
  private today: any;

  /**
   * Represents the first of the month shown in the datepicker
   */
  currentDate: Date;
  /**
   * Represents the array of weekdays names to be displayed on calendar
   */
  weekdays: string[];
  /**
   * Represents the array of months names to be displayed on calendar
   */
  monthsNames: string[];

  /**
   * Indicates if the datepicker is expanded or not
   */
  @HostBinding('class.is-datepicker--active')
  active = false;

  /**
   * Indicates if the calendar is focused
   */
  calendarFocused = false;

  /**
   * Represents the date selected by the user
   */
  private _selectedDate: IsDate;

  /**
   * Indicates if the date is invalid
   */
  invalid = false;

  /**
   * Represents the dates selected by the user.
   * Note: This property is for multiple date selection
   */
  private _selectedDates: IsDate[] = [];

  /**
   * Represents the dates of type date selected by the user.
   * Note: This property is for multiple date selection
   */
  private _selectedFormattedDates: Date[] = [];

  /**
   * Whether or not to enable multiple date selection. Default is false
   */
  @Input()
  multiple = false;

  /**
   * Callback to be executed after the user selects a date
   */
  @Output()
  onDateSelected = new EventEmitter<Date>();

  /**
   * Placeholder for date textbox
   */
  @Input()
  placeholder = '';

  /**
   * Input element for date
   */
  @ViewChild('dateInput')
  dateInput;

  /**
   * Names of the weekdays to be displayed on calendar
   */
  @Input()
  weekdaysNames: string[];

  /**
   * Indicates if the datepicker is readonly or not.
   *
   * Note: Default value is TRUE preventing users to manually enter
   * dates in input and letting them only pick from date picker panel.
   */
  @Input()
  readonly = true;

  /**
   * Default placement value. This value is set to 'bottom'
   */
  defaultPlacement: IsDatePickerPlacement = IsDatePickerPlacement.Bottom;
  private _placement: IsDatePickerPlacement;

  /**
   * The value is set to specify the placement for calendar. Accepted values
   * are 'top' and 'bottom'
   */
  @Input()
  set placement(value: IsDatePickerPlacement) {
    this._placement = value;
    if (value === IsDatePickerPlacement.Top) {
      // favor top positions, falling back to bottom positions
      this.connectedOverlayPositions = [
        POSITION_PAIRS.topLeft,
        POSITION_PAIRS.topRight,
        POSITION_PAIRS.bottomLeft,
        POSITION_PAIRS.bottomRight
      ];
    } else {
      // favor bottom positions, falling back to top positions
      this.connectedOverlayPositions = [
        POSITION_PAIRS.bottomLeft,
        POSITION_PAIRS.bottomRight,
        POSITION_PAIRS.topLeft,
        POSITION_PAIRS.topRight
      ];
    }
  }

  get placement(): IsDatePickerPlacement {
    return this._placement || this.defaultPlacement;
  }

  /**
   * Preferred positions settings to use from most preferable to least preferable
   */
  connectedOverlayPositions: ConnectionPositionPair[] = [
    POSITION_PAIRS.bottomLeft,
    POSITION_PAIRS.bottomRight,
    POSITION_PAIRS.topLeft,
    POSITION_PAIRS.topRight
  ];

  /**
   * The scroll strategy to use for the overlay
   */
  overlayScrollStrategy: ScrollStrategy;


  /**
   * An array of disabled dates. Two accepted formats:
   * 1. 'year month day weekday'. Example:
   *  a. ['* * * 0,6'] Will disable all weekends
   *  b. ['2017 * * *'] Will disable all the dates in 2017
   *  c. ['2017 3 * 0,6'] Will disable all weekends of April. Month ranges from
   * 0, 11. 0 for Jan and 11 for Dec
   * 2. Array of dates of Date object. Example
   *  let today = new Date(); let tomorrow = new
   * Date();tomorrow.setDate(today.getDate()+1); a. [today, tomorrow] Will
   * disable current date and next day after current date.
   */
  @Input()
  disabledDates: any;

  /**
   * Whether or not to disable weekends. Default is false
   */
  @Input()
  disableWeekends = false;

  /**
   * Whether or not to always show calendar. Default is false
   */
  @Input()
  alwaysVisible = false;

  /**
   * Direction of the calendar. Accepted values
   * 1. 1 creates a future-only calendar excluding today's date
   * 2. -1 (a negative integer) creates a past-only calendar excluding todays's
   * date
   * 3. 0 creates a calendar with no restrictions
   * 4. 2 creates a future-only calendar but includes todays' date
   * 5. -2 creates a past only calendar but includes today's date
   *
   * Note that: disabledDates property will still apply
   */
  @Input()
  direction: IsDatePickerDirection = IsDatePickerDirection.NoRestriction;

  /**
   * The format function for the date
   */
  @Input()
  formatFn: IsDateFormatFunction;

  /**
   * Format for the date returned. Default is 'MM/DD/YYYY'.
   * The string format should be date-fns compatible.
   * See [date-fns docs]{@link https://date-fns.org/v1.29.0/docs/format} for
   * date-fns formats
   */
  @Input()
  formatStr = 'MM/DD/YYYY';

  /**
   * Whether or not to show today button. Default is false
   */
  @Input()
  showToday = false;

  /**
   * Whether or not the datepicker popup should be dismissed once a date is
   * selected. Default is true
   *
   * @memberOf IsDatepicker
   */
  @Input()
  hideOnSelect = true;

  /**
   * The format function to convert a string back to date
   * Used to convert string from editable input
   */
  @Input()
  stringToDateFormatter: IsDatepickerStringToDateFormatter = dateConst.DF_DEFAULT_STRING_TO_DATE_FORMATTER;

  /**
   * Function to propagate changes when the control is changed
   *
   * @memberOf IsDatepicker
   */
  private propagateChange = (_: any) => { };

  /**
   * Function that allows forms API to update itself
   *
   * @memberOf IsDatepicker
   */
  private touched = () => { };


  /**
   * Returns the selected date
   */
  get selectedDate(): Date {
    return new Date(this._selectedDate.year, this._selectedDate.month, this._selectedDate.day);
  }

  /**
   * Sets the given date as selected date
   * @param date
   */
  set selectedDate(date: Date) {
    if (date) {
      const currentJulianDay = IsCalendarUtils.getJulianDay(date.getDate(), date.getMonth(), date.getFullYear());
      // Build the selected date
      this._selectedDate = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        isToday: currentJulianDay === this.today.julianDay,
        isPast: currentJulianDay < this.today.julianDay
      };
    } else {
      this._selectedDate = this.today;
    }
  }

  /**
   * Creates an instance of IsDatepicker.
   * @param overlay The overlay service
   */
  constructor(overlay: Overlay) {
    this.overlayScrollStrategy = overlay.scrollStrategies.reposition({ autoClose: false, scrollThrottle: 20 });
  }

  /**
   * Initialization method for datepicker component
   */
  ngOnInit() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.today.julianDay = IsCalendarUtils.getJulianDay(
      this.today.getDate(),
      this.today.getMonth(),
      this.today.getFullYear());
    this.currentDate = this.today;
    this.days = this.getCurrentMonthArray(this.today);
    this.weekdays = this.weekdaysNames || dateConst.WEEKDAYS;
    this.monthsNames = dateConst.MONTHS;
  }

  /**
   * Get the current month array
   * @param date
   */
  private getCurrentMonthArray(date: Date): IsDate[] {
    const lastDay = this.getLastDay(date);
    const offset = this.getWeekOffset(date);
    const arraySize = 42;
    const arr = Array.apply(null, Array(arraySize));
    return arr.map((val, i) => {
      const monthDay = i - offset + 1;
      const currentJulianDay = IsCalendarUtils.getJulianDay(monthDay, date.getMonth(), date.getFullYear());
      // Build the rendered date
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: (i >= offset && i < (offset + lastDay)) ? monthDay : 0,
        isToday: currentJulianDay === this.today.julianDay,
        isPast: currentJulianDay < this.today.julianDay
      };
    });
  }

  /**
   * Get the day 0 of the next month to get the last day of the current month
   * @param date
   */
  private getLastDay(date: Date) {
    const offset = date.getMonth() === 11 ? -11 : 1;
    return new Date(date.getFullYear(), date.getMonth() + offset, 0).getDate();
  }

  /**
   * Get the day of the week this month starts at
   * @param date
   */
  private getWeekOffset(date: Date) {
    return startOfMonth(date).getDay();
  }

  /**
   * Shows previous month
   */
  showPreviousMonth() {
    const month = this.currentDate.getMonth() === 0 ? 11 : this.currentDate.getMonth() - 1;
    const year = month === 11 ? this.currentDate.getFullYear() - 1 : this.currentDate.getFullYear();
    this.renderMonth(year, month);
  }

  /**
   * Shows next month
   */
  showNextMonth() {
    const month = this.currentDate.getMonth() === 11 ? 0 : this.currentDate.getMonth() + 1;
    const year = month === 0 ? this.currentDate.getFullYear() + 1 : this.currentDate.getFullYear();
    this.renderMonth(year, month);
  }

  /**
   * Render the month days when year and month is passed
   * @param year year to be rendered
   * @param month month to be rendered
   */
  renderMonth(year: number, month: number) {
    this.currentDate = new Date(year, month, 1);
    this.days = this.getCurrentMonthArray(this.currentDate);
  }

  /**
   * Returns the month name by passing month number
   * @param numMonth month number
   */
  getMonthName(numMonth: number) {
    return this.monthsNames[numMonth];
  }

  /**
   * Callback fired when a day is selected
   * @param day date to be set as selected date
   */
  _onDaySelected(day: IsDate) {
    this.invalid = false;
    const selected = new Date(day.year, day.month, day.day);
    this.onDateSelected.emit(selected);
    if (this.multiple) {
      if (this.isDaySelected(day)) {
        const idx = this._selectedDates.findIndex(date => date.year === day.year && date.month === day.month && date.day === day.day);
        this._selectedFormattedDates.splice(idx, 1);
        this._selectedDates.splice(idx, 1);
      } else {
        this._selectedFormattedDates.push(selected);
        this._selectedDates.push(day);
      }
      this.propagateChange(this._selectedFormattedDates);
      this.dateInput.nativeElement.value = this._selectedDates;
    } else {
      this.propagateChange(selected);
      // paint date in input
      this.dateInput.nativeElement.value = this.formatDate(selected);
      this._selectedDate = day;
    }



    if (this.hideOnSelect) {
      this.active = this.alwaysVisible;
      this.calendarFocused = false;
    }
  }

  /**
   * Callback fired when a day is changed in input
   * @param text date to be set as selected date
   */
  _onDayInputChange(text: string): void {
    // if it is readonly or if the text has just been changed to invalid, ignore
    if (this.readonly || text === DF_DATEPICKER_INVALID_MESSAGE) {
      return;
    }

    // user cleared text, so must be trying to reset the value
    if (text === '') {
      this.invalid = false;
      this._selectedDate = null;
      this.onDateSelected.emit(null);
      this.propagateChange(null);
    } else {
      const date = this.stringToDateFormatter(text, this.formatStr);

      const today = new Date();
      // a date was returned
      if (date) {
        this.invalid = false;

        const selected: IsDate = {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          isToday: date.toDateString() === today.toDateString(),
          isPast: date.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
        };
        this._selectedDate = selected;
        this.onDateSelected.emit(date);
        this.propagateChange(date);
        this.renderMonth(selected.year, selected.month);
      } else {
        // no date returned, it is invalid
        this.invalid = true;
        this._selectedDate = null;
        this.onDateSelected.emit(null);
        this.propagateChange(null);
        // lets return the calendar to the current day
        this.renderMonth(today.getFullYear(), today.getMonth());
      }
    }
  }

  /**
   * This method will be called when the model bound to this control changes.
   * Mandatory when implementing ControlValueAccessor.
   *
   * @param date object set in ngModel
   * @memberOf IsDatepicker
   */
  writeValue(date: any): void {
    if (this.multiple) {
      if (date && date.length) {
        date.map((dt, idx) => {
          if (typeof dt !== 'object') {
            dt = new Date(dt);
          }
          const currentJulianDay = IsCalendarUtils.getJulianDay(dt.getDate(), dt.getMonth(), dt.getFullYear());
          // Build the date
          const isDate = {
            year: dt.getFullYear(),
            month: dt.getMonth(),
            day: dt.getDate(),
            isToday: currentJulianDay === this.today.julianDay,
            isPast: currentJulianDay < this.today.julianDay
          };
          this._onDaySelected(isDate);
          return isDate;
        });
      }
    } else {
      if (typeof date !== 'undefined' && date instanceof Date) {
        this.dateInput.nativeElement.value = this.formatDate(date);
        this.selectedDate = date;
        this.renderMonth(date.getFullYear(), date.getMonth());
        if (this.alwaysVisible) {
          this.dateInput.nativeElement.click();
        }
        this.active = this.alwaysVisible;
      } else {
        this.dateInput.nativeElement.value = '';
        this.selectedDate = this.currentDate;
      }
    }
  }

  /**
   * Registers the method to call when data changes.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * Needed for the ControlValueAccessor implementation.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.touched = fn;
  }

  /**
   * Callback fired when input text for datepicker loses focus
   * @param evt
   */
  onInputBlur(evt: Event) {
    const clickTarget: HTMLInputElement = evt.target as HTMLInputElement;
    if (clickTarget && clickTarget.classList.contains('is-datepicker__btn')) {
      this.dateInput.nativeElement.focus();
    }
    if (this.invalid) {
      this.dateInput.nativeElement.value = DF_DATEPICKER_INVALID_MESSAGE;
    }
    this.touched();
  }

  /**
   * Checks if the given date is the selected day
   * @param day IsDate object
   */
  isDaySelected(day: IsDate) {
    // match the date from the array of selected dates if multiple option is true
    if (this.multiple) {
      for (const date of this._selectedDates) {
        const matches = day.day !== 0 ? (day.year === date.year
          && day.month === date.month
          && day.day === date.day) : false;
        if (matches) {
          return true;
        }
      }
      return false;
    }
    return day.day !== 0 ? this._selectedDate && (day.year === this._selectedDate.year
      && day.month === this._selectedDate.month
      && day.day === this._selectedDate.day) : false;
  }

  /**
   * Check if given date is disabled
   * @param day object
   */
  isDateDisabled(day: IsDate) {
    let dateDisabled: boolean;
    let directionDisabled = false;
    let weekendDisabled = false;
    const date = new Date(day.year, day.month, day.day);
    if (this.disableWeekends) {
      if (date.getDay() === 6 || date.getDay() === 0) {
        weekendDisabled = true;
      }
    }

    if (this.direction !== IsDatePickerDirection.NoRestriction) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      switch (this.direction) {
        case IsDatePickerDirection.FutureOnly:
          this.today.setHours(23, 59, 59);
          directionDisabled = date.getTime() < this.today.getTime();
          break;
        case IsDatePickerDirection.PastOnly:
          directionDisabled = yesterday.getTime() < date.getTime();
          break;
        case IsDatePickerDirection.PastWithToday:
          this.today.setHours(0, 0, 0);
          directionDisabled = this.today.getTime() < date.getTime();
          break;
        case IsDatePickerDirection.FutureWithToday:
          directionDisabled = yesterday.getTime() > date.getTime();
          break;
      }
    }

    dateDisabled = this.checkDateDisabled(date);
    return dateDisabled || weekendDisabled || directionDisabled;
  }

  /**
   * This method is used to check if the given date is disabled
   * @param date object
   */
  private checkDateDisabled(date: Date) {
    let isDateDisabled = false;
    let isRegexDisabled = false;
    if (this.disabledDates && this.disabledDates.length > 0) {
      this.disabledDates.forEach((disabledDate) => {
        if (Object.prototype.toString.call(disabledDate) === '[object Date]') {
          if (!isDateDisabled) {
            isDateDisabled = this.areDatesEqual(date, disabledDate);
          }
        } else {
          const regexDate = disabledDate.split(' ');
          const yearDisable = this.isRegexContainTime(regexDate[0], date.getFullYear()
            .toString());
          const monthDisable = this.isRegexContainTime(regexDate[1], date.getMonth()
            .toString());
          const dayDisable = this.isRegexContainTime(regexDate[2], date.getDate()
            .toString());
          const weekDayDisable = this.isRegexContainTime(regexDate[3], date.getDay()
            .toString());

          if (regexDate[0] !== '*' || regexDate[1] !== '*' || regexDate[2] !== '*' || regexDate[3] !== '*') {
            isRegexDisabled = true;
          }
          if (regexDate[0] !== '*') {
            isRegexDisabled = yearDisable;
          }
          if (regexDate[1] !== '*') {
            isRegexDisabled = isRegexDisabled && monthDisable;
          }
          if (regexDate[2] !== '*') {
            isRegexDisabled = isRegexDisabled && dayDisable;
          }
          if (regexDate[3] !== '*') {
            isRegexDisabled = isRegexDisabled && weekDayDisable;
          }
        }
      });
    }

    return isDateDisabled || isRegexDisabled;
  }

  /**
   * Check if given regular expression contains given time component
   * @param regex regular expression
   * @param time time component
   *   component
   */
  private isRegexContainTime(regex: string, time: string) {
    let isTimeDisabled = false;
    if (regex !== '*') {
      const timeToDisable = regex.split(',');
      isTimeDisabled = timeToDisable.indexOf(`${time}`) !== -1;
      if (!isTimeDisabled) {
        timeToDisable.forEach((disabledTime) => {
          const dateArray = disabledTime.split('-');
          if (dateArray.length === 2) {
            const consecutiveDateArray = this.getConsecutiveNumbers(dateArray[0], dateArray[1]);
            isTimeDisabled = consecutiveDateArray.indexOf(parseInt(time, 10)) !== -1;
          }
        });
      }
    }
    return isTimeDisabled;
  }

  /**
   * Used to get the consecutive numbers between given range
   * @param minRange minimum Range
   * @param maxRange maximum Range
   *   range
   */
  private getConsecutiveNumbers(minRange: string, maxRange: string) {
    const dateArray = [];
    let current = parseInt(minRange, 10);
    while (current <= parseInt(maxRange, 10)) {
      dateArray.push(current);
      current++;
    }
    return dateArray;
  }

  /**
   * Used to check if datepicker is visible
   */
  get isDatepickerVisible() {
    return this.alwaysVisible || this.active;
  }

  /**
   * This method is used to format date. FormatFn takes precedence over
   * formatStr
   * @param date to be formatted
   */
  formatDate(date: Date): string {
    return this.formatFn ? this.formatFn(date) : this.parseDate(date);
  }

  /**
   * This method is used to format date using date-fns library.
   * @param date date to be formatted
   */
  private parseDate(date: Date) {
    return format(date, this.formatStr);
  }

  /**
   * This method is getter for datepicker placement class
   */
  get datepickerPlacementClass() {
    return `is-datepicker--${this.placement.toString()}`;
  }

  /**
   * Callback to be executed after the user clicks on Today button
   */
  setDateToday() {
    this.onDateSelected.emit(this.today);
    this.propagateChange(this.today);
    this.dateInput.nativeElement.value = this.formatDate(this.today);
    this.currentDate = this.today;
    this.selectedDate = this.today;
    this.renderMonth(this.today.getFullYear(), this.today.getMonth());
    if (this.hideOnSelect) {
      this.active = this.alwaysVisible;
      this.calendarFocused = false;
    }
  }

  /**
   * Returns the month & year string for the widget header
   */
  getMonthHeader(): string {
    return this.getMonthName(this.currentDate.getMonth()) + ' ' +
      this.currentDate.getFullYear();
  }

  /**
   * This method is used to check if given dates are equal
   * @param firstDate firstDate to compare
   * @param secondDate secondDate to compare
   */
  areDatesEqual(firstDate: Date, secondDate: Date) {
    return (firstDate.getFullYear() === secondDate.getFullYear() &&
      firstDate.getMonth() === secondDate.getMonth() &&
      firstDate.getDate() === secondDate.getDate());
  }

  /**
   * This method is used to toggle active status
   */
  toggleActiveStatus() {
    this.active = this.alwaysVisible ? true : !this.active;
    this.calendarFocused = !this.calendarFocused;
  }

  /**
   * This method is used to calculate the displayed date on calendar
   * @param day
   */
  calculateDisplayDate(day: IsDate) {
    return day.day !== 0 ? ((day.day < 10 ? '0' : '') + day.day) : '';
  }

}
