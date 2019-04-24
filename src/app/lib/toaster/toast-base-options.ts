import { IsToastPosition } from './toast-position';

/**
 * Base options for toast which are configurable
 */
export class IsBaseToastOptions {
  /**
   * Whether or not the toast will close on click. Default is true.
   */
  closeOnClick?: boolean;

  /**
   * Time in milliseconds in which toast will close. Default is 5000.
   */
  autoCloseTime?: number;

  /**
   * Whether or not the auto close time is applied.
   */
  hasAutoCloseTime?: boolean;

  /**
   * Whether or not the close button will appear on toast. Default is false.
   */
  showCloseButton?: boolean;

  /**
   * Possible values: "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-center", "bottom-right"
   * Default is 'top-left'
   */
  position?: IsToastPosition;

  /**
   * Whether or not the newly created toast will appear first in sequence. Default is true.
   */
  newestFirst?: boolean;

  /**
   * Toast width. Default 320px
   */
  width?: string;

  /**
   * Constructor for IsBaseToastOptions
   */
  constructor() {
    this.closeOnClick = true;
    this.hasAutoCloseTime = true;
    this.autoCloseTime = 5000;
    this.showCloseButton = false;
    this.position = IsToastPosition.TopRight;
    this.newestFirst = true;
    this.width = '320px';
  }
}
