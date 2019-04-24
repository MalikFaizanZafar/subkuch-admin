import { IsPortalOrientation } from './portal-orientation';

/**
 * Portal options
 */
export class IsPortalOptions<D = any> {
  /**
   * Whether or not animations should be on
   */
  animationsOn: boolean;

  /**
   * Whether or not to show backdrop. Default is true.
   */
  showBackdrop: boolean;

  /**
   * Show template content. Default is true.
   */
  showTemplateContentAlways: boolean;

  /**
   * Portal orientation. Default is IsPortalOrientation.Bottom
   */
  orientation: IsPortalOrientation;

  /**
   * Whether or not to show close button. Default is false.
   */
  showCloseButton: boolean;

  /**
   * Whether or not to show header. Default is false.
   */
  showHeader: boolean;

  /**
   * Header title. Default is empty string.
   */
  headerTitle: string;

  /**
   * Optional payload to pass from the source component.
   *   - TemplateRef: via let-data="data"
   *   - Component: via DI with the IsActivePortal.data
   * It could be string or object or array
   */
  data: D;

  /**
   * Height of the portal. If a number is provided, pixel units are assumed.
   * Height should only be provided for Top and Bottom oriented portals.
   * It would be ignored for Left and Right oriented portals
   */
  height: number | string;

  /**
   * Width of the portal. If a number is provided, pixel units are assumed.
   * Width should only be provided for Left and Right oriented portals.
   * It would be ignored for Top and Bottom oriented portals
   */
  width: number | string;

  /**
   * Maximum height of the portal. If a number is provided, pixel units are assumed.
   * Maximum height should only be provided for Top and Bottom oriented portals.
   * It would be ignored for Left and Right oriented portals
   */
  maxHeight: number | string;

  /**
   * Maximum width of the portal. If a number is provided, pixel units are assumed.
   * Maximum width should only be provided for Left and Right oriented portals.
   * It would be ignored for Top and Bottom oriented portals
   */
  maxWidth: number | string;

  /**
   * Class names to be used with '.is-portal'
   * class. This is used when portal is
   * created using portal service
   */
  classNames: string[];

  /**
   * Whether or not close on escape keypress.
   * Default is true
   */
  closeOnEsc: boolean;

  /**
   * Whether or not to close on backdrop click.
   * Default is true
   */
  closeOnBackdropClick: boolean;

  /**
   * Constructor for IsPortalOptions
   * Defines the default values of the attributes
   */
  constructor() {
    this.showBackdrop = true;
    this.orientation = IsPortalOrientation.Bottom;
    this.showTemplateContentAlways = true;
    this.showCloseButton = false;
    this.showHeader = false;
    this.headerTitle = '';
    this.animationsOn = false;
    this.closeOnBackdropClick = true;
    this.closeOnEsc = true;
  }
}
