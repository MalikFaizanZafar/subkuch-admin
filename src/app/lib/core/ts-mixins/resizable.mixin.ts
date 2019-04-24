import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'; // tslint:disable-line
import { OnInit } from '@angular/core';

import { Constructor } from '../shared/model/constructor';
import { IsResizeService } from '../shared/service';
import { IsDestructable } from './destructable.mixin';

/**
 * Directive with access to the IsResizeService
 */
export interface IsHasResizableService {
  /**
   * The reference to the resize service
   */
  readonly _resizeService: IsResizeService;
}

/**
 * Mixin to augment a directive with a `onResize` method to handle changes in window size.
 */
export function mixinResizable<
  T extends Constructor<IsHasResizableService & IsDestructable>
>(base: T): any {
  return class extends base implements OnInit {

    /**
     * Abstract function that needs to be implemented by its descendants
     * in order to properly resize upon window resizing.
     */
    onResize(): void {}

    /**
     * Constructor pattern for applying mixins
     * @param args
     */
    constructor(...args: any[]) {
      super(...args);
    }

    /**
     * OnInit hook to start listening to resize event
     */
    ngOnInit(): void {
      this._resizeService.onWindowResize
      .pipe(takeUntil(this._destroy$))
      .subscribe(this.onResize.bind(this));
    }
  };
}
