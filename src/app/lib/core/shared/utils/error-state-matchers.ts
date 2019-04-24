import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

/**
 * Strategy to show messages if the parent form has been submitted
 * @param state
 */
export function showOnFormSubmittedErrorStateMatcher(
  control: AbstractControl | null,
  form: FormGroupDirective | NgForm | null): boolean {
  return !!(control && control.invalid && form && form.submitted);
}

/**
 * Strategy to show messages if the control has been touched or the parent form has been submitted
 * @param state
 */
export function showOnTouchedOrFormSubmittedErrorStateMatcher(
  control: AbstractControl | null,
  form: FormGroupDirective | NgForm | null): boolean {
  return !!(control && control.invalid && ((control.touched || !control.pristine) || form && form.submitted));
}

/**
 * Strategy to show messages if the control is dirty and parent form has been submitted
 * @param state
 */
export function showOnTouchedAndFormSubmittedErrorStateMatcher(
  control: AbstractControl | null,
  form: FormGroupDirective | NgForm | null): boolean {
  return !!(control && control.invalid && ((control.touched || !control.pristine) && (!form || (form && form.submitted))));
}

/**
 * Strategy to show messages if the control is dirty or parent form has been submitted
 * @param state
 */
export function showOnDirtyOrFormSubmittedErrorStateMatcher(
  control: AbstractControl | null,
  form: FormGroupDirective | NgForm | null): boolean {
  return !!(control && control.invalid && (control.dirty || (form && form.submitted)));
}

/**
 * Strategy to show messages if the control is dirty and parent form has been submitted
 * @param state
 */
export function showOnDirtyAndFormSubmittedErrorStateMatcher(
  control: AbstractControl | null,
  form: FormGroupDirective | NgForm | null): boolean {
  return !!(control && control.invalid && control.dirty && form && form.submitted);
}

/**
 * Strategy to always show messages
 * @param state
 */
export function showAlwaysErrorStateMatcher(
  control: AbstractControl | null,
  form: FormGroupDirective | NgForm | null): boolean {
  return true;
}
