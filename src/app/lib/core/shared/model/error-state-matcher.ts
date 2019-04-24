import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

/**
 * Signature for an error state matcher
 */
export type IsErrorStateMatcher = (control: AbstractControl | null, form: FormGroupDirective | NgForm | null) => boolean;
