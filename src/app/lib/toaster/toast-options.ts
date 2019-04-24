import { IsTheme } from '../core/shared/model/theme';
import { IsBaseToastOptions } from './toast-base-options';

/**
 * Options class for toast component
 */
export class ToastOptions extends IsBaseToastOptions {
  /**
   * Type of toast.
   * Possible values: "light", "success", "info", "warning", "error", "dark".
   * Default is ""
   */
  type?: IsTheme = null;

  /**
   * Title of the toast - will be displayed as a bold text.
   */
  title?: string;

  /**
   * Font awesome icon. e.g. "fa-check".
   */
  faIcon?: string;

  /**
   * Constructor for ToastOptions
   */
  constructor() {
    super();
    this.type = null;
    this.faIcon = '';
  }
}
