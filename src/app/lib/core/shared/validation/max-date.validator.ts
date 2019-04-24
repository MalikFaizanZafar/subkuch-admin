import { AbstractControl } from '@angular/forms';

import { TypedValidatorFunction } from '../model/typed-validator-function';
import { isDefined } from '../utils/utils';

/**
 * Resulting validation error for maxDateValidator
 */
export interface MaxDateValidationObject {
  /**
   * The max date specified
   */
  max: Date;
  /**
   * The actual date of the form control
   */
  actual: Date;
  /**
   * Optional format to be used for the error message
   */
  format?: string;
}

/**
 * Generates a max date validator
 * @param maxDate
 * @param param format to be included in the validation object
 */
export function maxDateValidator(
  maxDate: Date,
  format: string = 'DD/MM/YY'
): TypedValidatorFunction<'maxDate', MaxDateValidationObject> {
  return (control: AbstractControl): Record<'maxDate', MaxDateValidationObject> => {
    const value: Date = control.value;
    if (!isDefined(value)) {
      return null;
    }
    if (value <= maxDate) {
      return null;
    }
    return {
      maxDate: {
        max: maxDate,
        actual: value,
        format
      }
    };
  };
}
