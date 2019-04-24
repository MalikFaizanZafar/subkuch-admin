import { AbstractControl } from '@angular/forms';

import { TypedValidatorFunction } from '../model/typed-validator-function';

/**
 * Generates a confirm validator
 * @param errorKey The error key
 * @param controlKey The name of the form control in the group
 * @param confirmKey The name of the confirmation form control in the group
 */
export function generateConfirmValidator<K extends string>(
  errorKey: K,
  controlKey: string,
  confirmKey: string
): TypedValidatorFunction<K, true> {
  return (control: AbstractControl): Record<K, true> => {
    if (control.value[controlKey] !== control.value[confirmKey]) {
      // casting to any here because Typescript does not correctly check this as a valid Record<K, true>
      return { [errorKey as string]: true } as any;
    }
    return null;
  };
}
