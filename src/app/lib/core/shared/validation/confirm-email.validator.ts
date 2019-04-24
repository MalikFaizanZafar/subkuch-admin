import { TypedValidatorFunction } from '../model/typed-validator-function';

import { generateConfirmValidator } from './confirm-validator-generator';

/**
 * Generates a confirm password validator
 * @param passwordKey The name of the email control in the form group
 * @param confirmKey The name of the confirm email control in the form group
 */
export function confirmEmailValidator(
  emailKey: string = 'email',
  confirmKey: string = 'confirm'
): TypedValidatorFunction<'confirmEmail', true> {
  return generateConfirmValidator('confirmEmail', emailKey, confirmKey);
}
