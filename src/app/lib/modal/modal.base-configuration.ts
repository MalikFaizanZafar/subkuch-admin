import { IsModalSize } from './modal-size';

/**
 * IsModalConfig holds global configuration for Modal
 */
export class IsModalConfig {
  /**
   * Size of modal
   * Defalut is small size
   */
  size: IsModalSize = IsModalSize.Small;

  /**
   * Whether or not modal has backdrop
   * or if backdrop is static.
   * Default is true.
   */
  backdrop: boolean | 'static' = true;
}
