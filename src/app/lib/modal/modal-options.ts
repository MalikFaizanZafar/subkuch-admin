import { IsModalSize } from './modal-size';

/**
 * Modal options
 */
export class IsModalOptions {
  /**
   * CSS class to set on the is-modal
   *
   * @memberof IsModalOptions
   */
  customClass?: string;

  /**
   * Size of the modal. It only affects its width.
   *
   * @memberof IsModalOptions
   */
  size?: IsModalSize;

  /**
   * Optional payload to pass from the source component.
   *   - TemplateRef: via let-data="data"
   *   - Component: via DI with the IsActiveModal.data
   * It could be string or object or array
   *
   * @memberof IsModalOptions
   */
  data?: any;

  /**
   * Whether a backdrop element should be created for a given modal (true by
   * default). Alternatively, specify 'static' for a backdrop which doesn't
   * close the modal on click.
   */
  backdrop?: boolean | 'static';
}
