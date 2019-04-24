import { TypedValidatorFunction } from '../model/typed-validator-function';

import { generateConfirmValidator } from './confirm-validator-generator';

/**
 * Generates a confirm password validator
 * @param passwordKey The name of the password control in the form group
 * @param confirmKey The name of the confirm password control in the form group
 */
export function confirmPasswordValidator(
  passwordKey: string = 'password',
  confirmKey: string = 'confirm'
): TypedValidatorFunction<'confirmPassword', true> {
  return generateConfirmValidator('confirmPassword', passwordKey, confirmKey);
}
