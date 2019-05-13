import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IsCheckboxChange, IsCheckboxState } from './checkbox.models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/** Monotonically increasing integer used to auto-generate unique ids for checkbox components. */
let nextId = 0;

/**
 * Provider Expression that allows is-checkbox to register as a
 * ControlValueAccessor. This allows it to support [(ngModel)].
 * @docs-private
 */
export const IS_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsCheckbox),
  multi: true
};

@Component({
  selector: 'is-checkbox',
  templateUrl: 'checkbox.html',
  styleUrls: ['checkbox.scss'],
  host: {
    'class': 'is-checkbox',
    '[class.is-checkbox__icon--indeterminate]': 'indeterminate',
    '[class.is-checkbox__icon--checked]': 'checked',
    '[class.is-checkbox__icon--disabled]': 'disabled',
    '[class.is-checkbox--label-before]': 'labelPosition === "before"'
  },
  providers: [IS_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsCheckbox implements ControlValueAccessor {
  /**
   * Attached to the aria-label attribute of the host element. In most cases,
   * arial-labelledby will take precedence so this may be omitted.
   */
  @Input('aria-label') ariaLabel = '';

  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded
   * to the input element
   */
  @Input('aria-labelledby')
  ariaLabelledby: string | null = null;

  private _uniqueId = `is-checkbox-${++nextId}`;

  /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
  @Input() id: string = this._uniqueId;

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string { return `${this.id || this._uniqueId}`; }

  /** Whether the checkbox should be disabled. */
  private _disabled = false;
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled( value: any ) {
    this._disabled = coerceBooleanProperty(value);
  }

  private _required: boolean;
  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }

  set required( value ) {
    this._required = coerceBooleanProperty(value);
  }

  /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
  @Input() labelPosition: 'before' | 'after' = 'after';

  /** Tabindex value that is passed to the underlying input element. */
  @Input() tabIndex = 0;

  /** Name value will be applied to the input element if present */
  @Input() name: string | null = null;

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output() change: EventEmitter<IsCheckboxChange> = new EventEmitter<IsCheckboxChange>();

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** The value attribute of the native input element */
  @Input() value = 'on';

  /** font-color of  checkbox label */
  @Input() labelColor: string;

  private _color: string;

  /** color of all checkbox state */
  @Input()
  get currentColor(): string {
    return this._color;
  }

  /** color of unchecked checkbox icon */
  @Input() uncheckedColor: string;

  /** color of indeterminate checkbox icon */
  @Input() indeterminateColor: string;

  /** color of checked checkbox icon */
  @Input() checkedColor: string;

  /** class for checked checkbox icon */
  @Input() checkedIcon: string;

  /** class for unchecked checkbox icon  */
  @Input() uncheckedIcon: string;

  /** color of indeterminate checkbox icon */
  @Input() indeterminateIcon: string;

  private _currentCheckState: IsCheckboxState = IsCheckboxState.UnChecked;
  private _checked = false;
  private _currentIconColor: string;
  private _indeterminate: boolean;
  private checkedIconDefault = 'fa fa-check-square';
  private uncheckedIconDefault = 'fa fa-square-o';
  private indeterminateIconDefault = 'fa fa-minus-square';

  private _currentIcon: string;
  get currentIcon(): string {
    this._currentIcon = this.getCurrentIcon(this._currentCheckState);
    return this._currentIcon;
  }

  get currentIconColor(): string {
    this._currentIconColor = this.getCurrentIconColor(this._currentCheckState);
    return this._currentIconColor;
  }

  /** Whether the checkbox is checked */
  @Input()
  get checked() {
    return this._checked ? this._checked : false;
  }

  set checked( checked ) {
    const newValue = coerceBooleanProperty(checked);
    this._currentCheckState = newValue ? IsCheckboxState.Checked : IsCheckboxState.UnChecked;
    if (newValue !== this.checked) {
      this._checked = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode
   * and can be used to represent a checkbox with three states, e.g. a checkbox
   * that represents a nested list of checkable items. Note that whenever
   * checkbox is manually clicked, indeterminate is immediately set to false.
   */
  @Input()
  get indeterminate() {
    return this._indeterminate;
  }

  set indeterminate( indeterminate: boolean ) {
    const changed = indeterminate !== this._indeterminate;
    this._indeterminate = indeterminate;
    if (changed) {
      const changedState = this._indeterminate ?
        IsCheckboxState.Indeterminate :
        (this.checked ? IsCheckboxState.Checked : IsCheckboxState.UnChecked);
      this._currentCheckState = changedState;
      this.indeterminateChange.emit(this._indeterminate);
    }
  }

  onTouched: () => any = () => {
  }

  private _controlValueAccessorChangeFn: ( value: any ) => void = () => {
  }

  constructor( private _changeDetectorRef: ChangeDetectorRef ) {
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * @param value Value to be set to the model.
   */
  writeValue( value: any ) {
    this.checked = !!value;
  }

  /**
   * Registers a callback to be triggered when the value has changed.
   * Implemented as part of ControlValueAccessor.
   * @param fn Function to be called on change.
   */
  registerOnChange( fn: ( value: any ) => void ) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control has been touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be triggered when the checkbox is touched.
   */
  registerOnTouched( fn: any ) {
    this.onTouched = fn;
  }

  /**
   * Sets the checkbox's disabled state. Implemented as a part of
   * ControlValueAccessor.
   * @param isDisabled Whether the checkbox should be disabled.
   */
  setDisabledState( isDisabled: boolean ) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }

  getCurrentIcon( newState ) {
    let icon;
    switch (newState) {
      case IsCheckboxState.Checked:
        icon = this.checkedIcon ? this.checkedIcon : this.checkedIconDefault;
        break;
      case IsCheckboxState.UnChecked:
        icon = this.uncheckedIcon ? this.uncheckedIcon : this.uncheckedIconDefault;
        break;
      default:
        icon = this.indeterminateIcon ? this.indeterminateIcon : this.indeterminateIconDefault;
    }
    return icon;
  }

  getCurrentIconColor( newState ) {
    let iconColor;
    switch (newState) {
      case IsCheckboxState.Checked:
        iconColor = this.getIconColor(this.checkedColor);
        break;
      case IsCheckboxState.UnChecked:
        iconColor = this.getIconColor(this.uncheckedColor);
        break;
      default:
        iconColor = this.getIconColor(this.indeterminateColor);
    }
    return iconColor;
  }

  getIconColor( color ) {
    return color ? color : '';
  }

  private _emitChangeEvent() {
    const event = new IsCheckboxChange();
    event.source = this;
    event.checked = this.checked;

    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
  }

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * Do not toggle on (change) event since IE doesn't fire change event when
   * indeterminate checkbox is clicked.
   * @param event
   */
  _onInputClick( event: Event ) {
    // We have to stop propagation for click events on the visual hidden input
    // element. By default, when a user clicks on a label element, a generated
    // click event will be dispatched on the associated input element. Since we
    // are using a label element as our root container, the click event on the
    // `checkbox` will be executed twice. The real click event will bubble up,
    // and the generated click event also tries to bubble up. This will lead to
    // multiple click events. Preventing bubbling for the second event will
    // solve that issue.
    event.stopPropagation();

    if (!this.disabled) {
      // When user manually click on the checkbox, `indeterminate` is set to
      // false.
      if (this._indeterminate) {
        Promise.resolve()
          .then(() => {
            this._indeterminate = false;
            this.indeterminateChange.emit(this._indeterminate);
          });
      }

      this.toggle();
      this._currentCheckState = this._checked ? IsCheckboxState.Checked : IsCheckboxState.UnChecked;

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one,
      // because we don't want to trigger a change event, when the `checked`
      // variable changes for example.
      this._emitChangeEvent();
    }
  }

  _onInteractionEvent( event: Event ) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }
}
