import { Injectable } from '@angular/core';
import { fromEvent, merge, Observable, Subject } from 'rxjs';

/**
 * Service class that acts as a listener for window mouseup event
 */
@Injectable({
  providedIn: 'root'
})
export class IsMouseUpService {

  /**
   * Whether service is already initialized
   */
  private initialized: boolean;

  /**
   * Emits event on MouseUp event
   */
  private _mouseUp: Subject<Event>;

  /**
   * Creates an instance of IsMouseUpService.
   */
  constructor() {
    this.initialized = false;
    this._mouseUp = new Subject();
  }

  /**
   * Initialize document's mouseup event listener.
   */
  private init(): void {
    const auxObservable: Observable<Event> = merge(
      fromEvent(window.document, 'touchend'),
      fromEvent(window.document, 'mouseup'));

    auxObservable.subscribe((event: Event) => {
      this._mouseUp.next(event);
    });

    this.initialized = true;
  }

  /**
   * Returns event subject.
   */
  get onMouseUp(): Subject<Event> {
    if (!this.initialized) {
      this.init();
    }

    return this._mouseUp;
  }
}
