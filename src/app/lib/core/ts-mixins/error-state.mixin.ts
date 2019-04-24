import {
  FormControl, FormGroupDirective, NgForm,
} from '@angular/forms';

import { Constructor } from '../shared/model/constructor';
import { IsErrorStateMatcher } from '../shared/model/error-state-matcher';
import { IsHasErrorState } from '../shared/model/has-error-state';

/**
 * A component that can update its error state
 */
export interface IsCanUpdateErrorState {
  /**
   * If the component is in a error state
   */
  errorState: boolean;

  /**
   * The matcher to use to verify if the error should be displayed or not
   */
  errorStateMatcher: IsErrorStateMatcher;

  /**
   * Method to update the error state
   */
  updateErrorState(): void;
}

/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState<T extends Constructor<IsHasErrorState>>(
  base: T
): Constructor<IsCanUpdateErrorState> & T {
  return class extends base {
    /** Whether the component is in an error state. */
    errorState: boolean = false;

    /**
     * The matcher to use to verify if the error should be displayed or not
     */
    errorStateMatcher: IsErrorStateMatcher;

    /**
     * Method to update the error state
     */
    updateErrorState(): void {
      const oldState: boolean = this.errorState;
      const parent: FormGroupDirective | NgForm = this._parentFormGroup || this._parentForm;
      const matcher: IsErrorStateMatcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control: FormControl = this.ngControl
        ? (this.ngControl.control as FormControl)
        : null;
      const newState: boolean = matcher(control, parent);

      if (newState !== oldState) {
        this.errorState = newState;
      }
    }

    /**
     * Constructor pattern for applying mixins
     * @param args
     */
    constructor(...args: any[]) {
      super(...args);
    }
  };
}
