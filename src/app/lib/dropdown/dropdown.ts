
/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 06/02/2017.
 */
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Optional,
  Inject,
  OnInit,
  OnChanges
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { mapProperties } from '../core/shared/utils/utils';
import { IsDropdownPlacement } from './dropdown-placement';
import { IsDropdownOptions } from './dropdown-options';
import { DROPDOWN_CONFIG } from './dropdown.config';

@Component({
  selector: 'is-dropdown,[is-dropdown]',
  templateUrl: 'dropdown.html',
  styleUrls: ['dropdown.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsDropdown implements OnChanges, OnInit {

  /**
   * To be used to set the placement of the dropdown menu.
   */
  private _placement: IsDropdownPlacement;

  /**
   * Whether or not inverse theme for dropdown menu
   * should be used.
   */
  private _inverse: boolean;

  /**
   * Whether or not the basic theme for dropdown button
   * should be applied.
   */
  private _basicButton: boolean;

  /**
   * To be used to set the title for the dropdown button.
   */
  @Input()
  title = '';

  /**
   * Whether or not inverse theme for dropdown menu
   * should be used.
   */
  @Input()
  get inverse() {
    return this._inverse;
  }
  set inverse(value) {
    this._inverse = coerceBooleanProperty(value);
  }

  /**
   * To be used to set the placement of the dropdown menu.
   */
  @Input()
  get placement() {
    return this._placement;
  }
  set placement(value) {
    this._placement = value;
  }

  /**
   * Whether or not the basic theme for dropdown button
   * should be applied.
   */
  @Input()
  get basicButton() {
    return this._basicButton;
  }
  set basicButton(value) {
    this._basicButton = coerceBooleanProperty(value);
  }

  /**
   * Options to be applied on the component when
   * the component will be declared.
   */
  @Input()
  options: IsDropdownOptions;

  /**
   * Constructor of the component
   * @param globalConfig Global Options that will be declared on invoking the module.
   */
  constructor(
    @Optional() @Inject(DROPDOWN_CONFIG)
    private globalConfig: IsDropdownOptions) { }

  /**
   * To be used to set the options on initialization.
   */
  ngOnInit() {
    this.getOptions();
  }

  /**
   * To be used to set the options on change detection cycle.
   */
  ngOnChanges() {
    this.getOptions();
  }

  /**
   * To be used to set the configuration options for dropdown.
   */
  getOptions() {
    // should get default options.
    const defaultOptions = new IsDropdownOptions;
    // should copy default options first then global options
    // and then will assign the page level options.
    const options = Object.assign({}, defaultOptions, this.globalConfig, this.options);

    mapProperties(options, {
      inverse: this.inverse,
      placement: this.placement,
      basicButton: this.basicButton
    });
    this.options = options;
  }
}
