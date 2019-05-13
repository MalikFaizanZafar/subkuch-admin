import {
  Component,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  HostBinding
} from '@angular/core';
import { Observable } from 'rxjs';

import { IsToast } from './toast';
import { ToastOptions } from './toast-options';
import { IsToastPosition } from './toast-position';
import { flyInOut } from './toast-animation';

/**
 * Class for toast-container
 */
@Component({
  selector: 'is-toast-container',
  styleUrls: ['toast-container.scss'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'toast-container.html',
  animations: [flyInOut]
})
export class IsToastContainer {

  /**
   * Array of toasts
   */
  public toasts: any[] = [];

  /**
   * Css class name to position the view container
   */
  private containerPosClass: IsToastPosition = IsToastPosition.TopRight;

  /**
   * Css class name to determine the ordering of the toasts inside the container
   */
  private containerOrderingClass = '';

  /**
   * Host class
   */
  @HostBinding('class')
  toastContainerClass: string;

  /**
   * List of Is toasts
   */
  @ViewChildren('isToasts')
  isToasts: QueryList<IsToast>;

  /**
   * Constructor to create an instance of toast-container
   */
  constructor() {
  }

  /**
   * This method is used to add toast to view container
   * @param message message to show on toast
   * @param options ToastOptions
   */
  addToastToContainer( message: string, options: ToastOptions ): Observable<IsToast> {
    // Add toast to toasts array
    this.toasts.push({message: message, options: options});
    // Update toaster container position
    this.containerPosClass = options.position;
    // Change ordering of toasts
    this.containerOrderingClass = options.newestFirst ? 'reverse' : '';

    this.toastContainerClass = 'is-toast-container ' + this.containerPosClass + ' ' + this.containerOrderingClass;
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(<IsToast> this.isToasts.last);
      }, 0);
    });
  }

  /**
   * Callback method called on click of toast
   * @param toast object of ISToast
   */
  onToastClick( toast: IsToast ) {
    if (toast.options.closeOnClick && !toast.options.showCloseButton) {
      this.removeToast(toast);
    }
  }

  /**
   * This method is used to remove toast from the toasts array
   * @param toast
   */
  removeToast( toast: any ) {
    const index = this.toasts.indexOf(toast);
    if (index >= 0) {
      this.toasts.splice(index, 1);
    }
  }
}
