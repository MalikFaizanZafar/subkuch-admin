import {
  ElementRef,
  Input,
  Directive,
  Optional,
  Self,
  HostListener,
  HostBinding
} from '@angular/core';
import {
  NgControl,
  NgForm,
  FormGroupDirective
} from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

let nextId = 0;

@Directive({
  selector: `input[type="text"],
    input[type="email"],
    input[type="number"],
    input[type="password"],
    input[type="search"],
    input[type="url"],
    textarea`
})
export class IsNativeInputDirective {

  /**
   * Whether or not the input is disabled.
   */
  private _disabled = false;

  /**
   * Whether or not the input is required.
   */
  private _required = false;

  /**
   * Whether or not the input has default class.
   */
  private _hasDefaultClass = false;

  /**
   * To be used to set the id for the input.
   */
  private _id: string = this.uid;

  /**
   * To be used to set the default id for the input.
   */
  private _uid: string;

  /**
   * Whether or not the input is resizable.
   */
  private _allowResize = false;

  /**
   * Whether or not the element is focused.
   */
  focused = false;

  /**
   * To be used to set the placeholder
   * attribute of the input.
   */
  @HostBinding('placeholder')
  @Input()
  placeholder = '';

  /**
   * Whether or not the input is resizable.
   */
  @HostBinding('class.is-input--resizable')
  @Input()
  get allowResize() {
    return this._allowResize;
  }
  set allowResize( value ) {
    this._allowResize = coerceBooleanProperty(value);
  }

  /**
   * Whether or not the element is disabled.
   */
  @HostBinding('disabled')
  @HostBinding('class.is-input--disabled')
  @Input()
  get disabled() {
    return this.ngControl ? this.ngControl.disabled : this._disabled;
  }
  set disabled( value: any ) {
    this._disabled = coerceBooleanProperty(value);
  }

  /**
   * Whether or not the input has default class.
   */
  @HostBinding('class.is-input')
  get hasDefaultClass() {
    return this._hasDefaultClass;
  }

  /**
   * To be used to set the default class to input.
   */
  attachDefaultClass() {
    this._hasDefaultClass = true;
  }

  /**
   * To be used to set the unique id of the element.
   */
  @HostBinding('id')
  @Input()
  get id() {
    return this._id;
  }
  set id( value: string ) {
    this._id = value || this.uid;
  }

  /**
   * Whether or not the input is required.
   */
  @HostBinding('required')
  @Input()
  get required() {
    return this._required;
  }
  set required( value: any ) {
    this._required = coerceBooleanProperty(value);
  }

  /**
   * To be used to set the input element's value.
   */
  get value() {
    return this.elementRef.nativeElement.value;
  }
  set value( value: string ) {
    this.elementRef.nativeElement.value = value;
  }

  /**
   * Whether or not the input is empty.
   */
  get empty() {
    return this.value == null || this.value === '';
  }

  /**
   * To be used to set the default id for input.
   */
  private get uid() {
    return (this._uid = this._uid || `is-input-${++nextId}`);
  }

  /**
   * To be used to set the css class for input textarea.
   */
  @HostBinding('class.is-input--textarea')
  private get isTextarea() {
    const nativeElement = this.elementRef.nativeElement;
    return nativeElement.nodeName
      ? nativeElement.nodeName.toLowerCase() === 'textarea'
      : false;
  }

  /**
   * Whether or not the input is in an error state.
   */
  @HostBinding('attr.aria-invalid')
  get inErrorState(): boolean {
    const control = this.ngControl;
    const isInvalid = control && control.invalid;
    const isTouched = control && control.touched;
    const isSubmitted =
      (this.parentFormGroup && this.parentFormGroup.submitted) ||
      (this.parentForm && this.parentForm.submitted);

    return !!(isInvalid && (isTouched || isSubmitted));
  }

  /**
   * Constructor of the directive.
   * @param elementRef
   * @param ngControl
   * @param parentForm
   * @param parentFormGroup
   */
  constructor(
    private elementRef: ElementRef,
    @Optional()
    @Self()
    public ngControl: NgControl,
    @Optional()
    private parentForm: NgForm,
    @Optional()
    private parentFormGroup: FormGroupDirective
  ) { }

  /**
   * To be used to set the focus on the input element.
   */
  focus() {
    this.elementRef.nativeElement.focus();
  }

  /**
   *  Whether or not the input is focused.
   */
  @HostListener('focus')
  onFocus() {
    this.focused = true;
  }

  /**
   * Whether or not the input lost focus.
   */
  @HostListener('blur')
  onBlur() {
    this.focused = false;
  }

  /**
   * Whether or not the input content changed.
   */
  @HostListener('input')
  onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }
}
