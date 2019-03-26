import { Directive, ElementRef, ViewContainerRef } from '@angular/core';

/**
 * Directive to deploy modal content
 */
@Directive({
  selector: '[isModalTemplate]'
})
export class IsModalTemplate {
  /**
   * Constructor
   * @param vcr
   * @param el
   */
  constructor( public vcr: ViewContainerRef, public el: ElementRef ) { }
}
