import {
  Component,
  Input,
  ViewEncapsulation,
  AfterContentInit,
  ContentChild,
  AfterContentChecked,
  HostListener,
  HostBinding,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { isIEBrowser } from '../core/index';
import { IsNativeInputDirective } from './input.directive';
import { getContainerMissingInputErrorMessage } from './input.errors';
import { IsToolTipDirective } from '../tooltip';
import { IsInputContainerTooltipPosition } from './input-tooltip-position';

@Component({
  selector: 'is-input-container',
  templateUrl: 'input.html',
  styleUrls: ['input.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'is-input-container',
    '[class.is-input-container--empty]': 'isNativeInput.empty',
    '[class.ng-untouched]': 'shouldForward("untouched")',
    '[class.ng-touched]': 'shouldForward("touched")',
    '[class.ng-pristine]': 'shouldForward("pristine")',
    '[class.ng-dirty]': 'shouldForward("dirty")',
    '[class.ng-valid]': 'shouldForward("valid")',
    '[class.ng-invalid]': 'shouldForward("invalid")',
    '[class.ng-pending]': 'shouldForward("pending")'
  }
})
export class IsInput implements AfterContentInit, AfterContentChecked {

  /**
   * Whether or not the tooltip is in valid state.
   */
  private _valid: boolean | null = null;

  /**
   * Whether or not numeric spinners should be shown on type=number inputs.
   */
  private _showSpinners = false;

  /**
   * To be used to set the error message.
   */
  @Input()
  errorMessage: string;

  /**
   * To be used to set the label for the input.
   */
  @Input()
  label: string;

  /**
   * To be used to set the content for tooltip.
   */
  @Input()
  tooltip: string;

  /**
   * To be used to set the custom tooltip by using template.
   */
  @Input()
  tooltipTemplate: TemplateRef<any>;

  /**
   * To be used to set the data for customTooltip.
   */
  @Input()
  tooltipData: any;

  /**
   * To be used to set the position of the tooltip.
   */
  @Input()
  tooltipPosition: IsInputContainerTooltipPosition = IsInputContainerTooltipPosition.Top;

  /**
   * To be used to set the position of
   * the tooltip for small screens.
   */
  @Input()
  mobileTooltipPosition: IsInputContainerTooltipPosition = IsInputContainerTooltipPosition.Left;

  /**
   * To be used to set the clss name for tooltip.
   */
  @Input()
  tooltipClassName: string;

  /**
   * Whether or not numeric spinners should be shown on type=number inputs.
   */
  @Input()
  get showSpinners() {
    return this._showSpinners;
  }
  set showSpinners(value) {
    this._showSpinners = coerceBooleanProperty(value);
  }

  /**
   * Tooltip for help icon.
   */
  @ViewChild('helpTooltip')
  helpTooltip: IsToolTipDirective;

  /**
   * To be used to set the input directive.
   */
  @ContentChild(IsNativeInputDirective)
  isNativeInput: IsNativeInputDirective;

  /**
   * To be used to set the css class
   * for spinner on number type input .
   */
  @HostBinding('class.is-input-container--spinners-removed')
  get spinnersHidden(): boolean {
    return !this.showSpinners;
  }

  /**
   * To be used to set the css class for disabled input.
   */
  @HostBinding('class.is-input-container--disabled')
  get disabled(): boolean {
    return this.isNativeInput.disabled;
  }

  /**
   * To be used to set the css class on input focus.
   */
  @HostBinding('class.is-input-container--focused')
  get focused(): boolean {
    return this.isNativeInput.focused;
  }

  /**
   * To be used to set the css class for invalid input.
   */
  @HostBinding('class.is-input-container--invalid')
  get invalid(): boolean {
    return !this.valid;
  }
  set invalid(value: boolean | null) {
    this._valid = value === null ? null : !value;
  }

  /**
   * Whether or not the mobile view is active.
   */
  isMobileView = false;

  /**
   * Whether or not the tooltip is visible.
   */
  isTooltipVisible = false;

  /**
   * Whether or not the tooltip is available.
   */
  get hasTooltip(): boolean {
    return !!this.tooltip;
  }

  /**
   * To be used to set the input id.
   */
  get inputId(): string {
    return this.isNativeInput ? this.isNativeInput.id : '';
  }

  /**
   * To be used to set the tooltip placement
   * on the base of screen size.
   */
  get tooltipPlacement() {
    return this.isMobileView ?
      this.mobileTooltipPosition : this.tooltipPosition;
  }

  /**
   * Whether or not the browser is IE.
   */
  get isIEMobile() {
    return isIEBrowser(this.platform);
  }

  /**
   * Whether or no the input is in valid state.
   */
  get valid(): boolean {
    return this._valid !== null
      ? this._valid
      : !this.isNativeInput.inErrorState;
  }
  set valid(value: boolean | null) {
    this._valid = value;
  }

  /**
   * Constructor of the component.
   * @param breakpointObserver
   * @param platform
   */
  constructor(
    breakpointObserver: BreakpointObserver,
    private platform: Platform
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.isMobileView = result.matches;
    });
  }

  /**
   * Life cycle method called after content initialization.
   * Validates if there is a container's input child.
   */
  ngAfterContentInit(): void {
    this.validateInputChild();
  }

  /**
   * Life cycle method called after content checked.
   * Validates if there is a container's input child.
   */
  ngAfterContentChecked(): void {
    this.validateInputChild();
  }

  /**
   * Determines whether a class from the NgControl should be forwarded to the host element.
   * @param prop
   */
  shouldForward( prop: string ): boolean {
    const control = this.isNativeInput ? this.isNativeInput.ngControl : null;
    return control !== null && (control as any)[prop];
  }

  /**
   * Callback for the click event of the input. The native input gets focus.
   */
  @HostListener('click')
  focusInput() {
    this.isNativeInput.focus();
  }

  /**
   * Callback for the input event of the input.
   */
  @HostListener('input')
  keyInput() {
    // Works for NgControl instances only (inputs that are part of some NgForm instance)
    if (this.isNativeInput.ngControl) {
      // using destructuring to create direct references to members of ngControl
      const { invalid, control } = this.isNativeInput.ngControl;
      // this is to ensure that errorMessage will be displayed from the first type if required
      this.invalid = invalid;
      // marks as touched to make sure that ng-touched is applied
      control.markAsTouched();
    }
  }

  /**
   * To be used to show the tooltip.
   */
  showTooltip() {
    this.isTooltipVisible = true;
    this.helpTooltip.show();
  }

  /**
   * To be used to hide the tooltip.
   */
  hideTooltip() {
    this.isTooltipVisible = false;
    this.helpTooltip.hide();
  }

  /**
   * To be used to bind the event for mouseover.
   */
  onMouseOver() {
    if (!this.isMobileView) {
      this.showTooltip();
    }
  }

  /**
   * To be used to bind the event for mouseout.
   */
  onMouseOut() {
    if (!this.isMobileView) {
      this.hideTooltip();
    }
  }

  /**
   * To be used to bind the event for touchstart.
   */
  onTouchStart() {
    if (this.isMobileView && !this.isIEMobile) {
      this.showTooltip();
    }
  }

  /**
   * To be used to bind the event for touchend.
   */
  onTouchEnd() {
    if (this.isMobileView && !this.isIEMobile) {
      this.hideTooltip();
    }
  }

  /**
   * To be used to bind the event for pointerover.
   */
  onPointerOver() {
    if (this.isMobileView && this.isIEMobile) {
      this.showTooltip();
    }
  }

  /**
   * To be used to bind the event for pointerout.
   */
  onPointerOut() {
    if (this.isMobileView && this.isIEMobile) {
      this.hideTooltip();
    }
  }

  /**
   * Throws an error if there is not container's input child.
   */
  private validateInputChild() {
    if (!this.isNativeInput) {
      throw new Error(getContainerMissingInputErrorMessage());
    }

    if (!this.isNativeInput.hasDefaultClass) {
      // todo fix when there would be a better solution
      // setTimeout is used to overcome ExpressionChangedAfterItWasCheckedError error thrown in dev mode.
      // https://github.com/angular/angular/issues/6005
      setTimeout(() => {
        if (this.isNativeInput) {
          this.isNativeInput.attachDefaultClass();
        }
      });
    }
  }
}
