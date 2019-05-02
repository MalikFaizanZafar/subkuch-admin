import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  AfterContentInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Platform } from '@angular/cdk/platform';

import { IsSlideToggleChange } from './slide-toggle.models';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IsSlideToggleRenderer } from './slide-toggle-renderer';
import { IsSlideTogglePosition, IsSlideToggleSize } from './slide-toggle-type';
import { HammerInput } from '../core/index';

let nextId = 0;
@Component({
  selector: 'is-slide-toggle',
  templateUrl: 'slide-toggle.html',
  styleUrls: ['slide-toggle.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.is-slide-toggle]': 'true',
    '[class.is-slide-toggle--checked]': 'checked',
    '[class.is-slide-toggle--disabled]': 'disabled',
    '[class.is-slide-toggle--focused]': 'focused',
    '[class.is-slide-toggle--label-before]': 'isLabelBefore',
    '[class.is-slide-toggle--sm]': 'isSizeSmall',
    '[class.is-slide-toggle--status-label]': 'statusLabel'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IsSlideToggle),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsSlideToggle implements ControlValueAccessor, AfterContentInit {

  /**
   * Unique Id for the component
   */
  private uniqueId = `is-slide-toggle-${++nextId}`;

  /**
   * Reference to the underlying input element.
   */
  @ViewChild('input') inputElement: ElementRef;

  /**
   * Whether or not component is disabled. Default is false.
   */
  private _disabled = false;

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled( value: any ) {
    this._disabled = coerceBooleanProperty(value);
  }

  /**
   * Whether or not component is checked
   */
  private _checked = false;
  @Input()
  get checked() {
    return this._checked;
  }

  set checked( value ) {
    const newValue = coerceBooleanProperty(value);
    if (this._checked !== newValue) {
      this._checked = newValue;
      this.onChange(this._checked);
    }
  }

  /**
   * Name value will be applied to the input element if present
   */
  @Input() name: string = null;

  /**
   * A unique id for the slide-toggle input. If none is supplied, it will be auto-generated.
   */
  @Input() id: string = this.uniqueId;

  /**
   * Used to specify the tabIndex value for the underlying input element.
   */
  @Input() tabIndex = 0;

  /**
   * Whether the label should appear after or before the slide-toggle. Defaults to 'after'
   */
  @Input() labelPosition: IsSlideTogglePosition = IsSlideTogglePosition.Before;

  /**
   * The size of the component. Possible values are sm and md. Default is md.
   */
  @Input() size: IsSlideToggleSize = IsSlideToggleSize.Medium;

  /**
   * Used to set the aria-label attribute on the underlying input element.
   */
  @Input('aria-label')
  ariaLabel: string = null;

  /**
   * Used to set the aria-labelledby attribute on the underlying input element.
   */
  @Input('aria-labelledby')
  ariaLabelledby: string = null;

  /**
   * Color of the component
   */
  @Input() color: string;

  /**
   * Color of the component when component is unchecked
   */
  @Input() offColor: string;


  /**
   * Whether the the slide-toggle bar has On/Off labels. Defaults to 'false'
   */
  private _statusLabel = false;
  @Input()
  get statusLabel() {
    return this._statusLabel;
  }
  set statusLabel( value: any ) {
    this._statusLabel = coerceBooleanProperty(value);
  }

  /**
   * Checked label for the  slide-toggle bar . Defaults to 'ON'
   */
  @Input() onStatusLabel = 'ON';


  /**
   * Checked label for the  slide-toggle bar . Defaults to 'ON'
   */
  @Input() offStatusLabel = 'OFF';

  /**
   * An event will be dispatched each time the slide-toggle changes its value.
   */
  @Output()
  change: EventEmitter<IsSlideToggleChange> = new EventEmitter<IsSlideToggleChange>();

  /**
   * An event will be dispatched each time the slide-toggle drag is started.
   */
  @Output()
  dragStart: EventEmitter<IsSlideToggleChange> = new EventEmitter<IsSlideToggleChange>();

  /**
   * An event will be dispatched each time the slide-toggle is being dragged.
   */
  @Output()
  dragMove: EventEmitter<IsSlideToggleChange> = new EventEmitter<IsSlideToggleChange>();

  /**
   * An event will be dispatched each time the slide-toggle drag is ended.
   */
  @Output()
  dragEnd: EventEmitter<IsSlideToggleChange> = new EventEmitter<IsSlideToggleChange>();

  private slideToggleRenderer: IsSlideToggleRenderer;

  /**
   * Callback function on change of the component state
   */
  private onChange: Function = () => {};

  /**
   * Callback function on touch of the component
   */
  private onTouched: Function = () => {};

  /**
   * Emits the change event to the `change` output EventEmitter
   */
  private emitChangeEvent() {
    this.change.emit({source: this, checked: this.checked});
  }

  /**
   * Returns the unique id for the visual hidden input.
   */
  get inputId(): string {
    return `${this.id || this.uniqueId}-input`;
  }

  constructor( public elementRef: ElementRef,
               private _platform: Platform,
               private changeDetectorRef: ChangeDetectorRef ) {
  }

  get isLabelBefore() {
    return this.labelPosition === IsSlideTogglePosition.Before;
  }

  get isSizeSmall() {
    return this.size === IsSlideToggleSize.Small;
  }

  get currentColor(): string {
    return this.checked ? this.color : this.offColor;
  }

  ngAfterContentInit() {
    this.slideToggleRenderer = new IsSlideToggleRenderer(this.elementRef, this._platform);
  }

  /**
   * The onChangeEvent method will be also called on click.
   * This is because everything for the slide-toggle is wrapped inside of a label,
   * which triggers a onChange event on click.
   * @param event
   */
  onChangeEvent( event: Event ) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the component's `change` output.
    event.stopPropagation();

    if (this.slideToggleRenderer.dragging) {
      this.inputElement.nativeElement.checked = this.checked;
      return;
    }
    this.toggle();

    // Emit our custom change event if the native input emitted one.
    // It is important to only emit it, if the native input triggered one, because
    // we don't want to trigger a change event, when the `checked` variable changes for example.
    this.emitChangeEvent();
  }

  onInputClick( event: Event ) {
    this.onTouched();

    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `slide-toggle` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }

  /**
   * Focuses the slide-toggle
   */
  focus() {
    this.inputElement.nativeElement.focus();
  }

  /**
   * Toggles the checked state of the slide-toggle
   */
  toggle() {
    this.checked = !this.checked;
  }

  /**
   * This method will be called when the model bound to this control changes.
   * Implemented as part of ControlValueAccessor.
   * @param value
   */
  writeValue( value: any ): void {
    this.checked = value;
  }

  /**
   * Provides a function that can be used later to propagate changes in the slide toggle.
   * Implemented as part of ControlValueAccessor.
   * @param fn
   */
  registerOnChange( fn: any ): void {
    this.onChange = fn;
  }

  /**
   * Provides a function that can be used later to propagate touch event in the slide toggle.
   * Implemented as part of ControlValueAccessor.
   * @param fn
   */
  registerOnTouched( fn: any ): void {
    this.onTouched = fn;
  }

  /**
   * Implemented as a part of ControlValueAccessor.
   * @param isDisabled
   */
  setDisabledState( isDisabled: boolean ): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  /**
   * Event callback fired on start of drag(panstart) event
   */
  onDragStart() {
    if (!this.disabled) {
      this.slideToggleRenderer.startThumbDrag(this.checked);
      this.dragStart.emit({source: this, checked: this.checked});
    }
  }

  /**
   * Event callback fired on drag(panmove) event
   * @param event
   */
  onDrag( event: HammerInput ) {
    if (this.slideToggleRenderer.dragging) {
      this.slideToggleRenderer.updateThumbPosition(event.deltaX);
      this.dragMove.emit({source: this, checked: this.checked});
    }
  }

  /**
   * Event callback fired on end of drag(panend) event
   */
  onDragEnd() {
    if (this.slideToggleRenderer.dragging) {
      this.dragEnd.emit({source: this, checked: this.checked});
      const newCheckedValue = this.slideToggleRenderer.dragPercentage > 50;
      if (newCheckedValue !== this.checked) {
        this.checked = newCheckedValue;
        this.emitChangeEvent();
      }
      setTimeout(() => this.slideToggleRenderer.stopThumbDrag());
    }
  }

}
