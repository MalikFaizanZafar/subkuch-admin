import {
  Directive,
  ElementRef,
  ViewContainerRef
} from '@angular/core';

/**
 * Directive to deploy portal content
 */
@Directive({
  selector: '[isPortalContent]'
})
export class IsPortalContent {
  /**
   * Creates instance of IsPortalContent
   * @param vcr View container reference
   * @param el Element reference
   */
  constructor(
    public vcr: ViewContainerRef,
    public el: ElementRef
  ) { }
}
