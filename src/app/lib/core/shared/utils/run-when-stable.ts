import { NgZone } from '@angular/core';
import { take } from 'rxjs/operators';

/**
 * Used in replacement to setTimeout or requestAnimationFrame, in order to avoid angular running a change detection cycle.
 * @param ngZone The NgZone Service
 * @param fn The function to call asyncronously
 */
export function runWhenStable(ngZone: NgZone, fn: () => void): void {
  ngZone.onStable.asObservable().pipe(take(1))
            .subscribe(fn);
}
