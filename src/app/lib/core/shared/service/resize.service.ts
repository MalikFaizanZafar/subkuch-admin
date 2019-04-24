import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Service class to act as a wrapper and listener for window resize event.
 */
@Injectable({
  providedIn: 'root'
})
export class IsResizeService {
  /**
   * Indicates if service is already initialized
   * or if first initialization
   */
  private initialized: boolean;

  /**
   * Emits event on window resize
   */
  private _windowResize: Subject<Event>;

  /**
   * Creates an instance of IsResizeService.
   */
  constructor() {
    this.initialized = false;
    this._windowResize = new Subject() as Subject<Event>;
  }

  /**
   * Initialize windows event listener and debounce by 200 ms
   */
  private init(): void {
    const delay: number = 200;
    const eventObservable: Observable<Event> = (fromEvent(window, 'resize') as Observable<Event>)
      .pipe(debounceTime(delay));
    eventObservable
      .subscribe(( event: Event ) => {
        this._windowResize.next(event);
      });
    this.initialized = true;
  }

  /**
   * return event subject as observable
   */
  get onWindowResize(): Observable<Event> {
    if (!this.initialized) {
      this.init();
    }

    return this._windowResize.asObservable();
  }
}
