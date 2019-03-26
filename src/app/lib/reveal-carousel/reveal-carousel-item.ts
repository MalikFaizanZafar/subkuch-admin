import {
  Directive,
  TemplateRef
} from '@angular/core';

/**
 * Directive to be used to represent the items.
 */
@Directive({ selector: 'ng-template[isRevealCarouselItem]' })
export class IsRevealCarouselItemDirective {
  constructor(public tplRef: TemplateRef<any>) { }
}
