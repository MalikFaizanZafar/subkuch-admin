import { Subject } from 'rxjs';

import { OnDestroy } from '@angular/core';

import { Constructor } from '../shared/model/constructor';

/**
 * A component that runs cleanup code on ngOnDestroy hook
 */
export interface IsDestructable extends OnDestroy {
  /**
   * Subject that emits when component is destroyed
   */
  readonly _destroy$: Subject<void>;
}

/**
 * Mixin to augment a directive with a `_destroy$` property that emits and completes on destruction
 */
export function mixinDestructable<T extends Constructor<{}>>(base: T): Constructor<IsDestructable> & T {
  return class extends base {

    /**
     * Subject that emits when component is destroyed
     */
    readonly _destroy$: Subject<void> = new Subject<void>();

    /**
     * On destroy life-cycle hook
     */
    ngOnDestroy(): void {
      this._destroy$.next();
      this._destroy$.complete();
    }

    /**
     * Constructor pattern for applying mixins
     * @param args
     */
    constructor(...args: any[]) { super(...args); }
  };
}
