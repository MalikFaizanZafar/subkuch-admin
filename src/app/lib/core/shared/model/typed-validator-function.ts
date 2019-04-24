import { AbstractControl } from '@angular/forms';

/**
 * A generic type to use for Control Validators instead of Angular's ValidationFn.
 * K is the key of the error
 * T is the type of validation object for that key
 */
export type TypedValidatorFunction<K extends string, T = any> = (
  c: AbstractControl
) => Record<K, T> | null;
