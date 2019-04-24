import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { Constructor } from '../shared/model/constructor';

/**
 * A component that can be disabled
 */
export interface IsCanDisable {
  /**
   * If the component is disabled.
   */
  disabled: boolean;
}

/**
 * Mixin to augment a directive with a `disabled` property.
 * Directive should use add the `disabled` property to the `inputs` property of the host,
 * since the @Input annotation cannot be placed when using the mixin
 */
export function mixinDisabled<T extends Constructor<{}>>(
  base: T
): Constructor<IsCanDisable> & T {
  return class extends base {

    /**
     * If the component is disabled.
     */
    protected _disabled: boolean = false;

    /**
     * If the component is disabled.
     */
    get disabled(): any {
      return this._disabled;
    }

    /**
     * Sets the disabled state
     */
    set disabled(value: any) {
      this._disabled = coerceBooleanProperty(value);
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
