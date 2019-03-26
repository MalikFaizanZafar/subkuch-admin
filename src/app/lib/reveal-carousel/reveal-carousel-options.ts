export class IsRevealCarouselOptions {

  /**
   * To be used to set the number of items to be visible.
   */
  numVisibleItems?: number;

  /**
   * To be used to set the factor for zooming of items.
   */
  scaleFactor?: number;

  /**
   * To be used to set the spacing between
   * items in pixels.
   */
  itemSpacing?: number;

  /**
   * Whether or not the side navigation button
   * should be visible.
   */
  sideNavigation?: boolean;

  /**
   * Whether or not the paging navigation
   * button should be visible.
   */
  paging?: boolean;

  auto?: boolean;

  timer?: number;

  constructor() {
    this.numVisibleItems = 3;
    this.scaleFactor = 1.3;
    this.itemSpacing = 6;
    this.sideNavigation = true;
    this.paging = true;
    this.auto = false;
    this.timer = 1;
  }
}
