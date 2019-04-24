import { IsErrorStateMatcher } from './error-state-matcher';
import { IsFormControl } from './form-control';

/**
 * A custom control with an error state
 */
export interface IsHasErrorState extends IsFormControl {
  /**
   * The default error state matcher to use to verify the error state
   */
  _defaultErrorStateMatcher: IsErrorStateMatcher;
}
