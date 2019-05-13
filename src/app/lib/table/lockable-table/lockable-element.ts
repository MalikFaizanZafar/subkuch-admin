import { ElementRef, Input, Renderer2 } from '@angular/core';

import { IS_COLORS } from '../../core/constants';

/**
 * Class that collects a few helpers for lockable elements
 *
 * @export
 */
export class IsLockableElement {

  /**
   * Constructor
   * @param el
   * @param renderer
   */
  constructor( protected el: ElementRef,
               protected renderer: Renderer2) {
  }

  /**
   * Element default styles
   */
  defaultStyles: Record<string, string> = {
    'position': 'absolute',
    'border': `1px solid ${IS_COLORS.LIGHT_GREY}`,
    'box-shadow': '1px 0 1px 2px rgba(203, 209, 211, 0.5)',
    'background': 'white',
    'z-index': '15',
    'height': 'inherit',
    'max-width': 'inherit',
    'left': '0',
    'top': '0',
    'overflow': 'hidden'
  };

  /**
   * Object that holds a dictionary of styles.
   * e.g:
   * {
   *  'position': 'absolute',
   *  'border': '1px solid black',
   *  'box-shadow': '1px 0 1px 2px rgba(203, 209, 211, 0.5)',
   *  'background': 'white',
   *  'z-index': '15',
   *  'width': '150px',
   * }
   */
  @Input()
  styles: Record<string, string>;

  /**
   * Width Element size
   */
  private _width;

  /**
   * Getter for data-attribute [order-id] value
   */
  get orderId(): number {
    return Number(this.el.nativeElement.getAttributeNode('order-id').value);
  }

  /**
   * Sets element style [top, left, height] props
   * @param top
   * @param left
   * @param width
   * @param height
   */
  adjustBondaries( top: number, left: number, width: number, height: number ) {
    this.adjustLeft(left);
    const heightError = 0.5; // Because of box-shadow, border and content height
    this.setStyle(this.el.nativeElement, {
      'top': `${top}px`,
      'min-width': `${width}px`,
      'width': `${width}px`,
      'height': `${height - heightError}px`
    });
  }

  /**
   * Sets style [left] prop
   * @param left
   */
  adjustLeft( left: number ) {
    this.setStyle(this.el.nativeElement, {
      'left': `${left}px`
    });
  }

  /**
   * Getter for the offsetLeft value from nativeElement
   */
  get left(): number {
    return this.el.nativeElement.offsetLeft;
  }

  /**
   * Getter for the offsetTop value from nativeElement
   */
  get top() {
    return this.el.nativeElement.offsetTop;
  }

  /**
   * Sets the Element width
   * @param width
   */
  @Input()
  set width( width: number ) {
    this._width = width;
    this.defaultStyles['min-width'] = `${width}px`;
    this.defaultStyles.width = `${width}px`;
  }

  /**
   * Getter for the width value from nativeElement
   */
  get width(): number {
    return this._width;
  }

  /**
   * Getter for the offsetHeight value from nativeElement
   */
  get height() {
    return this.el.nativeElement.offsetHeight;
  }

  /**
   * Set styles for this element, via renderer
   * @param elementRef
   * @param stylesDict
   */
  setStyle( elementRef: HTMLElement, stylesDict: Record<string, string> ) {
    for (const key in stylesDict) {
      if (stylesDict.hasOwnProperty(key)) {
        const value = stylesDict[key];
        this.renderer.setStyle(elementRef, key, value);
      }
    }
  }

  /**
   * Set styles for this element, via renderer
   * @param elementRef
   * @param stylesDict
   */
  removeStyles( elementRef, stylesDict ) {
    for (const key in stylesDict) {
      if (stylesDict.hasOwnProperty(key)) {
        this.renderer.removeStyle(elementRef, key);
      }
    }
  }

  /**
   * Add or remove styling for locked/unlocked elements
   * @param locked
   */
  adjustStyles( locked: boolean ) {
    const styles = Object.assign({}, this.defaultStyles, this.styles);

    if (locked) {
      this.setStyle(this.el.nativeElement, styles);
    } else {
      this.removeStyles(this.el.nativeElement, styles);
    }
  }
}
