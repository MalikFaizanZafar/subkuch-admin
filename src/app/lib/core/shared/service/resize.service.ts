/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 21/03/2017.
 */
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class IsResizeService {
  private initialized: boolean;
  private _windowResize: Subject<Event>;

  constructor() {
    this.initialized = false;
    this._windowResize = <Subject<Event>> new Subject();
  }

  /**
   * Initialize windows event listener and debounce by 200 ms
   */
  private init() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(( event: Event ) => {
        this._windowResize.next(event);
      });
    this.initialized = true;
  }

  /**
   * return event observable
   */
  get onWindowResize(): Observable<Event> {
    if (!this.initialized) {
      this.init();
    }

    return this._windowResize.asObservable();
  }
}
