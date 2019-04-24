import { AbstractControl } from '@angular/forms';

import { TypedValidatorFunction } from '../model/typed-validator-function';
import { isDefined } from '../utils/utils';

/**
 * Resulting validation error for minDateValidator
 */
export interface MinDateValidationObject {
  /**
   * The min date specified
   */
  min: Date;
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
 * Generates a min date validator
 * @param minDate
 * @param param format to be included in the validation object
 */
export function minDateValidator(minDate: Date, format: string = 'DD/MM/YY'): TypedValidatorFunction<'minDate', MinDateValidationObject> {
  return (control: AbstractControl): Record<'minDate', MinDateValidationObject> => {
    const value: Date = control.value;
    if (!isDefined(value)) {
      return null;
    }
    if (value >= minDate) {
      return null;
    }
    return {
      minDate: {
        min: minDate,
        actual: value,
        format
      }
    };
  };
}
