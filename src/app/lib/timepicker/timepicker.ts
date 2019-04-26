import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Output,
  Input,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IsTimePickerHelper as helper } from './timepicker.helper';
import { timePickerFadeInOut } from './timepicker.animation';
import { IsTimePickerPlacement, IsTimePickerState, IsTimePickerMeridian } from './timepicker.model';

const isTimepickerValueAccessor = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsTimePicker),
  multi: true
};

@Component({
  selector: 'is-timepicker',
  templateUrl: 'timepicker.html',
  styleUrls: ['timepicker.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'class': 'is-timepicker'},
  animations: [timePickerFadeInOut],
  providers: [isTimepickerValueAccessor]
})

export class IsTimePicker implements ControlValueAccessor {
  state: IsTimePickerState = new IsTimePickerState();
  time: Date = new Date();
  oldTime: Date = null;
  initial = false;

  /**
   * This value is set to format the time in 24-hour format. Must be true/false
   */
  @Input()
  format24Hour = false;

  /**
   * This value is set to handle timepicker visibility. Must be true/false
   */
  @Input()
  alwaysVisible = false;

  defaultPlacement: IsTimePickerPlacement = IsTimePickerPlacement.Bottom;
  private _placement: IsTimePickerPlacement;

  /**
   * The value is set to specify the placement for timepicker. Accepted values are 'top' and 'bottom'
   */
  @Input()
  set placement( value ) {
    this._placement = value;
  }

  get placement() {
    return this._placement || this.defaultPlacement;
  }

  /**
   * This event is used to send the updated time
   */
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * Creates an instance of IsTimePicker.
   * @param  changeDetectorRef
   */
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Whether or not any of the inputs(hour, minute, meridian) are focused.
   */
  anyInputFocused(): boolean {
    return (
      this.state.hoursFocused ||
      this.state.minutesFocused ||
      this.state.meridianFocused
    );
  }

  /**
   * Checks if the hours are between the valid range. If not, the value is
   * modified accordingly. Also updates the focus state of the input.
   */
  checkHours(): void {
    const hour = this.format24Hour ? 23 : 12;
    this.checkNumber('hours', 0, hour);
    this.updateFocus('hours', false);
    this.emitChanges();
  }

  /**
   * Checks if the meridian is valid. If not, the value is modified
   * accordingly. Also updates the focus state of the input.
   */
  checkMeridian(): void {
    if (/^[pP]/i.test(this.state.meridian.toString())) {
      this.state.meridian = IsTimePickerMeridian.PM;
    } else if (/^[aA]/i.test(this.state.meridian.toString())) {
      this.state.meridian = IsTimePickerMeridian.AM;
    }
    this.updateFocus('meridian', false);
    this.emitChanges();
  }

  /**
   * Checks if the minutes are between the valid range. If not, the value is
   * modified accordingly. Also updates the focus state of the input.
   */
  checkMinutes(): void {
    this.checkNumber('minutes', 0, 59);
    this.updateFocus('minutes', false);
    this.emitChanges();
  }

  /**
   * Checks if a number is inside the valid range. The number is modified if
   * needed. The numbers get formated to show two digits.
   * @param type if you're checking for hours or minutes.
   * @param min range limit.
   * @param max range limit.
   */
  checkNumber( type: string, min: number, max: number ): void {
    if (this.state[type] !== '') {
      let number = Number(this.state[type]);
      if (number > max) {
        number = max;
      } else if (number < min) {
        number = min;
      }
      this.state[type] = helper.formatNumber(number);
    }
  }

  /**
   * Gets data from the time: Date input and moves it to the component state.
   */
  dateToState(): void {
    if (this.time !== null) {
      this.state.hours = this.format24Hour
        ? `${this.time.getHours()}`
        : helper.formatNumber(helper.formatHours12(this.time.getHours()));
      this.state.minutes = helper.formatNumber(this.time.getMinutes());
      this.state.meridian = this.format24Hour ? null : helper.formatMeridian(this.time.getHours());
    } else {
      this.state.hours = '';
      this.state.minutes = '';
      this.state.meridian = '';
    }
  }

  /**
   * Checks if the output is valid, and if it is, emit the changes.
   */
  private emitChanges() {
    let oldState = '';
    const newState = `${this.state.hours}:${this.state.minutes}`;
    if (this.oldTime) {
      const oldTimeHour = this.format24Hour
        ? `${this.oldTime.getHours()}`
        : helper.formatNumber(helper.formatHours12(this.oldTime.getHours()));
      oldState = this.oldTime ? `${oldTimeHour}:${this.oldTime.getMinutes()}` : '';
    }
    if (this.isStateValid() && (!this.oldTime || (newState !== oldState))) {
      this.stateToDate();
      if (!this.initial) {
        this.change.emit(this.time);
      }
      this.onChange(this.time);
      this.oldTime = this.time;
    }
  }

  /**
   * Checks if the user has filled all the fields.
   */
  isStateValid(): boolean {

    // If meridian is null set it to 'AM' ( Default )
    if (this.state.meridian == null) {
      this.state.meridian = IsTimePickerMeridian.AM;
    }

    return (
      this.state.hours.length > 0 &&
      this.state.minutes.length > 0 &&
      (this.format24Hour || this.state.meridian.toString().length > 0)
    );
  }

  /**
   * Needed in the registerOnChange
   * @param _
   */
  onChange( _: any ): void {
  }

  /**
   * When the wrapper gets clicked, focus the hours if nothing else has focus.
   * @param hours reference to the hours input field.
   */
  onInputClick( hours: any ): void {
    if (!this.anyInputFocused()) {
      hours.focus();
    }
    this.state.inputFocused = !this.state.inputFocused;
  }

  /**
   * Only allow the user to use certain keys (aApPmM).
   * @param event
   */
  onlyMeridian(event: KeyboardEvent): void {
    const key = event.key;
    if (!/[aApPmM]/i.test(key)) {
      event.preventDefault();
    }
  }

  /**
   * Only allow the user to use the number keys.
   * @param event
   */
  onlyNumbers( event: any ) {
    if (!/[0-9]/i.test(event.key)) {
      event.preventDefault();
    }
  }

  /**
   * Registers the method to call when data changes.
   * @param fn
   */
  registerOnChange( fn: any ): void {
    this.onChange = fn;
  }

  /**
   * Needed for the ControlValueAccessor implementation.
   * @param fn
   */
  registerOnTouched( fn: any ): void {
  }

  /**
   * Gets data from the component state and moves it to the time: Date input
   */
  stateToDate(): void {
    if (
      this.state.hours.length > 0 &&
      this.state.minutes.length > 0
    ) {
      const hour = this.format24Hour
        ? Number(this.state.hours)
        : helper.formatHours24(this.state.hours, this.state.meridian.toString());
      this.time = new Date();
      this.time.setHours(hour);
      this.time.setMinutes(Number(this.state.minutes));
    } else {
      this.time = null;
    }
  }

  /**
   * Updates the hours or minutes by the amount and emits the changes. Use
   * negative amounts to subtract.
   * @param type hours or minutes.
   * @param value to add.
   * @param element
   */
  updateBy( type: string, value: number, element ): void {
    this.updateFocus('ui', true);
    const hour = this.format24Hour ? 23 : 12;
    let number = Number(this.state[type]);
    number = number + value;
    this.state[type] = number;
    if (type === 'hours') {
      if (this.format24Hour) {
        this.checkNumber(type, 0, hour);
      } else {
        this.checkNumber(type, 1, hour);
      }
    } else {
      this.checkNumber(type, 0, 59);
    }
    this.emitChanges();
  }

  /**
   * Updates the focus of an input.
   * @param input to update.
   * @param value
   */
  updateFocus( input: string, value: boolean ) {
    this.state[`${input}Focused`] = value;
  }

  /**
   * Updates the state and emits changes.
   * @param meridian
   */
  updateMeridian( meridian: IsTimePickerMeridian ): void {
    this.state.meridian = meridian;
    this.emitChanges();
  }

  /**
   * Initializes the input values.
   * @param obj passed through [(ngModel)]
   */
  writeValue( obj: Date ): void {
    if (obj !== undefined) {
      this.initial = true;
      this.time = obj;
      this.dateToState();
      this.emitChanges();
      this.initial = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Whether or not timepicker popup is visible
   */
  get isTimepickerVisible() {
    return this.alwaysVisible || this.state.inputFocused;
  }

  /**
   * @hidden
   */
  get timepickerPlacementClass() {
    return 'is-timepicker__ui--' + this.placement.toString()
      .toLowerCase();
  }
}
