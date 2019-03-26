import {
  Directive,
  ElementRef
} from '@angular/core';

/**
 *  Directive to be used to make the items expandable.
 */
@Directive({ selector: 'div[isRevealCarouselExpandable]' })
export class IsRevealCarouselExpandableDirective {
  constructor(public elemRef: ElementRef) { }
}
