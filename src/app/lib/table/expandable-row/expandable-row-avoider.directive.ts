import {
  Directive,
  AfterViewInit,
  ElementRef
} from '@angular/core';

/**
 * is-expandable-row-avoider allows dev to mark some HTMLElement instances
 * that are tipically implementing a click event to make sure that .toggleExpand()
 * won't be triggered once click on the element is taking place.
 *
 * This is a workaround due some issue in Angular where either .stopPropagation()
 * and .stopImmediatePropagation() cannot prevent events bubbling.
 * https://github.com/angular/angular/issues/9587
 */
@Directive({
  selector: '[is-expandable-row-avoider]'
})
export class IsExpandableRowAvoider implements AfterViewInit {

  constructor(private el: ElementRef) {
  }

  /**
   * ngAfterViewInit
   *
   * @memberof IsExpandableRowAvoider
   */
  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.el.nativeElement.expandableRowAvoider = true;
    });
  }
}
