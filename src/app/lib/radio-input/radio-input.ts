import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IsRadioInputChange } from './radio-input-change';
import { IsRadioInputLabelPosition } from './radio-input-label-position';
import { IsRadioInputService } from './radio-input.service';
import { IsRadioInputConfig } from './radio-input.base-configuration';
import { RADIO_INPUT_CONFIG } from './radio-input.config';

/**
 * Control value accessor for radio group
 */
export const IS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IsRadioGroup),
  multi: true
};

/**
 * A group of radio inputs.
 */
@Component({
  selector: 'is-radio-group',
  template: `<ng-content></ng-content>`,
  providers: [IS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
  host: {
    'role': 'radiogroup'
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsRadioGroup implements AfterContentInit, ControlValueAccessor {
  /**
   * Label position for the group
   */
  @Input() labelPosition: IsRadioInputLabelPosition;

  /**
   * Whether or not input is disabled
   * Getter
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * Whether or not input is disabled
   * Setter
   * @param value
   */
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value !== null && value !== false) ? true : null;
  }

  /**
   * Name of the radio group
   * Getter
   */
  @Input()
  get name(): string {
    return this._name;
  }

  /**
   * Name of the radio group
   * Setter
   * @param value
   */
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  /**
   * Selected radio input for the group
   * Getter
   */
  @Input()
  get selected(): any {
    return this._selected;
  }

  /**
   * Selected radio input for the group.
   * Setter
   * Updates value for the group,
   * and deselects the other radios.
   * @param selected
   */
  set selected(selected: any | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();

    if (this.radios) {
      this.radios.forEach(radio => {
        radio.checked = radio.value === this.value;
        document.getElementById(`radio-outer-${radio.id}`).style.borderColor = radio.radioColor;
        document.getElementById(`radio-inner-${radio.id}`).style.backgroundColor = radio.radioColor;
      });
    }
  }

  /**
   * Value of the group
   * Getter
   */
  @Input()
  get value(): string {
    return this._value;
  }

  /**
   * Value of the group
   * Setter
   * @param newValue
   */
  set value(newValue: string) {
    if (this._value !== newValue) {
      this._value = newValue;

      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }

  /**
   * Event emitter for changes in the radio
   */
  @Output()
  change: EventEmitter<IsRadioInputChange> = new EventEmitter<IsRadioInputChange>();

  /**
   * Child radio inputs
   */
  @ContentChildren(forwardRef(() => IsRadioInput))
  radios: QueryList<IsRadioInput> = null;

  /**
   * Indicates whether the group is disabled
   */
  private _disabled = false;

  /**
   * Generated name for the group
   */
  private _name: string;

  /**
   * Reference to selected radio input if any
   */
  private _selected: IsRadioInput = null;

  /**
   * Value of selected radio input if any
   */
  private _value: string = null;

  /**
   * Indicates whether the component has been initialized
   */
  private _isInitialized = false;

  /**
   * Updates current selected radio's checked property
   */
  private _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  /**
   * Updates selected radio input variable for the group
   */
  private _updateSelectedRadioFromValue() {
    const isAlreadySelected = this._selected !== null
      && this._selected.value === this._value;

    if (this.radios !== null && !isAlreadySelected) {
      this._selected = null;
      this.radios.forEach(radio => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  /**
   * Updates all child radio input names with the
   * same value as the group name.
   */
  private _updateRadioButtonNames() {
    if (this.radios) {
      this.radios.forEach(radio => {
        radio.name = this.name;
      });
    }
  }

  /**
   * Constructor
   * @param radioInputService
   */
  constructor (private radioInputService: IsRadioInputService) {}

  /**
   * Default on change implementation
   * for control value accessor
   */
  onChangeFn = (value: any) => {};

  /**
   * Default on touched implementation
   * for control value accessor
   */
  onTouchedFn = () => {};

  /**
   * Sets initialized flag as true
   */
  ngAfterContentInit() {
    this._isInitialized = true;
    this.name = `is-radio-group-${this.radioInputService.registerRadioInput()}`;
  }

  /**
   * Sets component's value
   * @param value
   */
  writeValue(value: any) {
    this.value = value;
  }

  /**
   * Registers on change function
   * @param fn
   */
  registerOnChange(fn: any) {
    this.onChangeFn = fn;
  }

  /**
   * Registers on touch implemenation
   * @param fn
   */
  registerOnTouched(fn: any) {
    this.onTouchedFn = fn;
  }

  /**
   * Sets disabled state
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * Emits changes if the group has been initialized
   */
  emitChangeEvent() {
    if (this._isInitialized) {
      const event = new IsRadioInputChange();
      event.source = this._selected;
      event.value = this._value;
      this.change.emit(event);
    }
  }
}

/**
 * Class to create IsRadioInput
 */
@Component({
  selector: 'is-radio-input',
  templateUrl: 'radio-input.html',
  styleUrls: ['radio-input.scss'],
  host: {
    'class': 'is-radio-input',
    '[class.is-radio-input__text--before]': 'isLabelPositionBefore',
    '[class.is-radio-input--checked]': 'checked',
    '[class.is-radio-input--disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsRadioInput implements OnInit {
  /**
   * Unique identifier for this radio
   */
  @Input() id = '';

  /**
   * The name of this radio
   */
  @Input() name: string;

  /**
   * Radio's preferred checked color
   */
  @Input() checkedColor: string;

  /**
   * Radio's preferred unchecked color
   */
  @Input() uncheckedColor: string;

  /**
   * Radio's preferred label color
   */
  @Input() labelColor: string;

  /**
   * Checked property of radio
   * Getter
   */
  @Input()
  get checked() {
    return this._checked;
  }

  /**
   * Checked property of this radio
   * Setter
   * @param checked
   */
  set checked(checked: boolean) {
    if (this._checked !== checked) {
      this._checked = coerceBooleanProperty(checked);

      if (this.radioGroup && checked && this.radioGroup.value !== this.value) {
        this.radioGroup.selected = this;
      } else if (this.radioGroup && !checked && this.radioGroup.value === this.value) {
        this.radioGroup.selected = null;
      }
    }
  }

  /**
   * Gets disabled value of this radio
   */
  @Input()
  get disabled(): boolean {
    return this._disabled || (this.radioGroup !== null && this.radioGroup.disabled);
  }

  /**
   * Disabled value of this radio
   * Setter
   * @param value
   */
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty((value !== null && value !== false) ? true : null);
  }

  /**
   * Label position. Gives priority to this radios label position
   * then to the group's.
   * Getter
   */
  @Input()
  get labelPosition(): IsRadioInputLabelPosition {
    return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition);
  }

  /**
   * Radio's label position.
   * Setter
   * @param value
   */
  set labelPosition(value: IsRadioInputLabelPosition) {
    this._labelPosition = value;
  }

  /**
   * Value of radio
   * Getter
   */
  @Input()
  get value(): string {
    return this._value;
  }

  /**
   * Value for this radio
   * Setter
   * @param value
   */
  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup) {
        if (!this.checked) {
          this.checked = this.radioGroup.value === value;
        }

        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }

  /**
   * Change event emitter
   */
  @Output()
  change: EventEmitter<IsRadioInputChange> = new EventEmitter<IsRadioInputChange>();

  /**
   * Radio color based on whether it is checked or unchecked
   * Getter
   */
  get radioColor(): string {
    this._radioColor = this.checked ? this.checkedColor : this.uncheckedColor;
    return this._radioColor;
  }

  /**
   * Global config
   */
  globalConfig: IsRadioInputConfig;

  /**
   * Radio color for this radio
   */
  private _radioColor;

  /**
   * Whether this radio is checked
   */
  private _checked = false;

  /**
   * Indicates whether this radio input is disabled
   */
  private _disabled = false;

  /**
   * Label position for this radio
   */
  private _labelPosition: IsRadioInputLabelPosition;

  /**
   * Value of this radio input
   */
  private _value: any;

  /**
   * Emits a radio input change event with source and value
   */
  private _emitChangeEvent() {
    const event = new IsRadioInputChange();
    event.source = this;
    event.value = this._value;
    this.change.emit(event);
  }

  /**
   * Constructor
   * @param radioGroup
   * @param radioInputService
   * @param config
   */
  constructor(
    @Optional() public radioGroup: IsRadioGroup,
    private radioInputService: IsRadioInputService,
    @Optional() @Inject(RADIO_INPUT_CONFIG) private config: IsRadioInputConfig
  ) {
    this.id = this.id || `is-radio-${this.radioInputService.registerRadioInput()}`;
    const defaultConfig = new IsRadioInputConfig();
    this.globalConfig = Object.assign({}, defaultConfig, this.config);
  }

  /**
   * Sets checked property and name of radio group if any
   */
  ngOnInit() {
    this.checkedColor = this.checkedColor || this.globalConfig.checkedColor;
    this.uncheckedColor = this.uncheckedColor || this.globalConfig.uncheckedColor;
    this.labelColor = this.labelColor || this.globalConfig.labelColor;
    this.labelPosition = this.labelPosition || this.globalConfig.labelPosition;

    if (this.radioGroup) {
      this.checked = this.radioGroup.value === this._value;
      this.name = this.radioGroup.name;
    }
  }

  /**
   * On click default implementation
   * @param event
   */
  onInputClick(event: Event) {
    event.stopPropagation();
    const groupValueChanged = this.radioGroup
        && this.value !== this.radioGroup.value;

    this.checked = true;
    this._emitChangeEvent();

    if (this.radioGroup) {
      this.radioGroup.onChangeFn(this.value);
      this.radioGroup.onTouchedFn();
      if (groupValueChanged) {
        this.radioGroup.emitChangeEvent();
      }
    }
  }

  /**
   * On change default implementation
   * @param event
   */
  onInputChange(event: Event) {
    event.stopPropagation();
  }

  /**
   * Checks if label position is before
   */
  get isLabelPositionBefore(): boolean {
    return this.labelPosition === IsRadioInputLabelPosition.Before;
  }
}
