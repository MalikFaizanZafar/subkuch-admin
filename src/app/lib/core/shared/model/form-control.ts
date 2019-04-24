import { FormGroupDirective, NgControl, NgForm } from '@angular/forms';

/**
 * Represents a custom form control
 */
export interface IsFormControl {
  /**
   * The parent form group directive, if defined
   */
  _parentFormGroup: FormGroupDirective;

  /**
   * The parent ngForm, if defined
   */
  _parentForm: NgForm;

  /**
   * The ngControl associated with this control
   */
  ngControl: NgControl;
}
