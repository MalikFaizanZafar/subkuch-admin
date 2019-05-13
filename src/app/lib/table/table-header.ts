import { Directive, ElementRef } from '@angular/core';

/**
 * Directive for IsTableHeader
 */
@Directive({
  selector: 'th'
})
export class IsTableHeader {

  constructor(
    public el: ElementRef
  ) {}

}
