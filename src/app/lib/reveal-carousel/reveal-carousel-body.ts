import {
  Directive,
  ElementRef
} from '@angular/core';

/**
 * Directive to be used to show contents in items.
 */
@Directive({ selector: 'div[isRevealCarouselBody]' })
export class IsRevealCarouselBodyDirective {
  constructor(public elemRef: ElementRef) { }
}
