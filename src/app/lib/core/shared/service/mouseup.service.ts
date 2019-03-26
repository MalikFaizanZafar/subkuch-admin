/**
 * Created by rgarcia<rafael.garcia@devfactory.com> on 25/08/2017.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Observable } from 'rxjs/internal/observable';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

@Injectable()
export class IsMouseUpService {
  private initialized: boolean;
  private _mouseUp: Subject<Event>;

  constructor() {
    this.initialized = false;
    this._mouseUp = new Subject();
  }

  /**
   * Initialize document's mouseup event listener.
   */
  private init() {
    const auxObservable: Observable<Event> = fromEvent(window.document, 'mouseup');

    auxObservable.subscribe((event) => {
      this._mouseUp.next(event);
    });

    this.initialized = true;
  }

  /**
   * Return event observable.
   */
  get onMouseUp(): Subject<Event> {
    if (!this.initialized) {
      this.init();
    }

    return this._mouseUp;
  }
}
