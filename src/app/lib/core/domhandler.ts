import { Injectable } from '@angular/core';

interface ViewPortOffset {
  width?: number;
  height: number;
  top?: number;
  left?: number;
}

interface UserAgentInfo {
  browser?: any;
  version?: any;
}

/**
 * This class defines and exposes several utilities to easily interact with the DOM
 */
@Injectable({
  providedIn: 'root',
})
export class DomHandler {
  /**
   * An arbitrary zindex value
   */
  public static zindex: number = 1000;

  /**
   * Helper variable to hold the scroll bar witdh
   */
  private calculatedScrollBarWidth: number = null;

  /**
   * Cache for browser evaluation
   */
  private browser: any;

  /**
   * Whether or not the screen is touchable.
   */
  private isTouchable: boolean = (('ontouchstart' in window)
       || (navigator.maxTouchPoints > 0)
       || (navigator.msMaxTouchPoints > 0));

  /**
   * Adds a class to a dom element. Adds the class to the classList if it exist otherwise
   * adds to the className attribute.
   * @param element
   * @param className
   */
  addClass(element: any, className: string): void {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ` ${className}`;
    }
  }

  /**
   * Adds classes to a dom element.
   * Adds the classes to the classList if it exist otherwise adds to the className attribute.
   * @param element
   * @param className
   */
  addMultipleClasses(element: any, className: string): void {
    if (element.classList) {
      const styles: string[] = className.split(' ');
      let style: string;
      for (style of styles) {
        element.classList.add(style);
      }
    } else {
      const styles: string[] = className.split(' ');
      let style: string;
      for (style of styles) {
        element.className += ` ${style}`;
      }
    }
  }

  /**
   * Remove a class in a dom element.
   * @param element
   * @param className
   */
  removeClass(element: any, className: string): void {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(
        new RegExp(
          `(^|\\b)${className.split(' ').join('|')}(\\b|$)`,
          'gi'
        ),
        ' '
      );
    }
  }

  /**
   * Whether a element has a class.
   * @param element
   * @param className
   */
  hasClass(element: any, className: string): boolean {
    if (element.classList) {
      return element.classList.contains(className);
    } else {
      return new RegExp(`(^| )${className}( |$)`, 'gi').test(
        element.className
      );
    }
  }

  /**
   * Returns the siblings of a given element
   * @param element
   */
  siblings(element: HTMLElement): any {
    return Array.prototype.filter.call((element.parentNode as HTMLElement).children, (
      child: HTMLElement
    ): boolean  => {
      return child !== element;
    });
  }

  /**
   * Returns a list of the elements within the document that match the specified group of selectors.
   * @param element
   * @param selector
   */
  find(element: any, selector: string): any[] {
    return element.querySelectorAll(selector);
  }

  /**
   * Returns the first element that is a descendant of the element
   * on which it is invoked that matches the specified group of selectors.
   * @param element
   * @param selector
   */
  findSingle(element: any, selector: string): any {
    return element.querySelector(selector);
  }

  /**
   * Returns the position index of the given element among its siblings
   * @param element
   */
  index(element: HTMLElement): number {
    const children: NodeListOf<Node & ChildNode> = element.parentNode.childNodes;
    let num: number = 0;

    // disabled for-of rule as for-of will work for array not for NodeList
    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < children.length; i++) {
      if (children[i] === element) {
        return num;
      }
      if (children[i].nodeType === 1) {
        num++;
      }
    }
    return -1;
  }

  /**
   * Get relative position of an element with respect to target.
   * @param element
   * @param target
   */
  relativePosition(element: any, target: any): void {
    const elementDimensions: ViewPortOffset = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const targetHeight: number = target.offsetHeight;
    const targetWidth: number = target.offsetWidth;
    const targetOffset: ViewPortOffset = target.getBoundingClientRect();
    const viewport: ViewPortOffset = this.getViewport();
    let top: number;
    let left: number;

    if (
      targetOffset.top + targetHeight + elementDimensions.height >
      viewport.height
    ) {
      top = -1 * elementDimensions.height;
      if (targetOffset.top + top < 0) {
        top = 0;
      }
    } else {
      top = targetHeight;
    }

    if (targetOffset.left + elementDimensions.width > viewport.width) {
      left = targetWidth - elementDimensions.width;
    } else {
      left = 0;
    }

    element.style.top = `${top}px` + 'px';
    element.style.left = `${left}px`;
  }

  /**
   * Get absolute position of an element with respect to target.
   * @param element
   * @param target
   */
  absolutePosition(element: any, target: any): void {
    const elementDimensions: ViewPortOffset = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const elementOuterHeight: number = elementDimensions.height;
    const elementOuterWidth: number = elementDimensions.width;
    const targetOuterHeight: number = target.offsetHeight;
    const targetOuterWidth: number = target.offsetWidth;
    const targetOffset: ViewPortOffset = target.getBoundingClientRect();
    const windowScrollTop: number = this.getWindowScrollTop();
    const windowScrollLeft: number = this.getWindowScrollLeft();
    const viewport: ViewPortOffset = this.getViewport();
    let top: number;
    let left: number;

    if (
      targetOffset.top + targetOuterHeight + elementOuterHeight >
      viewport.height
    ) {
      top = targetOffset.top + windowScrollTop - elementOuterHeight;
      if (top < 0) {
        top = 0 + windowScrollTop;
      }
    } else {
      top = targetOuterHeight + targetOffset.top + windowScrollTop;
    }

    if (
      targetOffset.left + targetOuterWidth + elementOuterWidth >
      viewport.width
    ) {
      left =
        targetOffset.left +
        windowScrollLeft +
        targetOuterWidth -
        elementOuterWidth;
    } else {
      left = targetOffset.left + windowScrollLeft;
    }

    element.style.top = `${top}px`;
    element.style.left = `${left}px`;
  }

  /**
   * Returns the outer height of a hidden element
   * @param element
   */
  getHiddenElementOuterHeight(element: HTMLElement): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight: number = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementHeight;
  }

  /**
   * Returns the outer width of a hidden element
   * @param element
   */
  getHiddenElementOuterWidth(element: HTMLElement): number {
    const displayOld: string = element.style.display;
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementWidth: number = element.offsetWidth;
    element.style.display = displayOld;
    element.style.visibility = 'visible';

    return elementWidth;
  }

  /**
   * Returns the dimensions of a hidden element
   * @param element
   */
  getHiddenElementDimensions(element: HTMLElement): {width: number, height: number} {
    const dimensions: any = {};
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    dimensions.width = element.offsetWidth;
    dimensions.height = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return dimensions;
  }

  /**
   * Scrolls a given container to an arbitrary view
   * @param container container for scrolling
   * @param item item to be scrolled
   */
  scrollInView(container: HTMLElement, item: HTMLElement): void {
    const borderTopValue: string = getComputedStyle(container).getPropertyValue(
      'borderTopWidth'
    );
    const borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
    const paddingTopValue: string = getComputedStyle(
      container
    ).getPropertyValue('paddingTop');
    const paddingTop: number = paddingTopValue
      ? parseFloat(paddingTopValue)
      : 0;
    const containerRect: ClientRect | DOMRect = container.getBoundingClientRect();
    const itemRect: ClientRect | DOMRect = item.getBoundingClientRect();
    const offset: number =
      itemRect.top +
      document.body.scrollTop -
      (containerRect.top + document.body.scrollTop) -
      borderTop -
      paddingTop;
    const scroll: number = container.scrollTop;
    const elementHeight: number = container.clientHeight;
    const itemHeight: number = this.getOuterHeight(item);

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }

  /**
   * Fades in an element within the timeframe specified by 'duration'
   * @param element the element to be faded
   * @param duration timeframe specified in 'ms'
   */
  fadeIn(element: HTMLElement, duration: number): void {
    element.style.opacity = '0';

    let last: number = +new Date();
    let opacity: number = 0;
    const tickDelay: number = 16;
    const tick: () => void = (): void => {
      opacity =
        +element.style.opacity.replace(',', '.') +
        (new Date().getTime() - last) / duration;
      element.style.opacity = opacity.toString();
      last = +new Date();

      if (+opacity < 1) {
        if (!(window.requestAnimationFrame && requestAnimationFrame(tick))) {
          setTimeout(tick, tickDelay);
        }
      }
    };

    tick();
  }

  /**
   * Fades out an element within the timeframe specified by 'ms'
   * @param element the element to be faded
   * @param ms timeframe specified in 'ms'
   */
  fadeOut(element: HTMLElement, ms: number): void {
    let opacity: number = 1;
    const interval: number = 50;
    const duration: number = ms;
    const gap: number = interval / duration;

    const fading: any = setInterval(() => {
      opacity = opacity - gap;

      if (opacity <= 0) {
        opacity = 0;
        clearInterval(fading);
      }
      element.style.opacity = opacity.toString();
    }, interval);
  }

  /**
   * Returns the number of scrolled pixels from the top
   */
  getWindowScrollTop(): number {
    const doc: HTMLElement = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  /**
   * Returns the number of scrolled pixels from the left
   */
  getWindowScrollLeft(): number {
    const doc: HTMLElement = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  /**
   * Whether or not the element would be selected by the specified selector string
   * @param element
   * @param selector
   */
  matches(element: HTMLElement, selector: string): boolean {
    const p: any = Element.prototype;
    const f: any =
      p['matches'] ||
      p.webkitMatchesSelector ||
      p['mozMatchesSelector'] ||
      p.msMatchesSelector ||
      function(this: HTMLElement, s: string): boolean {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
      };
    return f.call(element, selector);
  }

  /**
   * Returns the outer width of an element.
   * @param el the element to which outer width will be calculated
   * @param margin if set to true, it will add the margins to the returned height
   */
  getOuterWidth(el: HTMLElement, margin?: boolean): number {
    let width: number = el.offsetWidth;

    if (margin) {
      const style: CSSStyleDeclaration = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
  }

  /**
   * Returns the horizontal paddings of an element
   * @param el the element to which horizontal padding will be calculated
   */
  getHorizontalPadding(el: HTMLElement): number {
    const style: CSSStyleDeclaration = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  /**
   * Returns the horizontal margins of an element
   * @param el the element to which horizontal margin will be calculated
   */
  getHorizontalMargin(el: HTMLElement): number {
    const style: CSSStyleDeclaration = getComputedStyle(el);
    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  /**
   * Returns the element's width with paddings
   * @param el the element to which inner width will be calculated
   */
  innerWidth(el: HTMLElement): number {
    let width: number = el.offsetWidth;
    const style: CSSStyleDeclaration = getComputedStyle(el);

    width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  /**
   * Returns the element's width without paddings
   * @param el the element to which width will be calculated
   */
  width(el: HTMLElement): number {
    let width: number = el.offsetWidth;
    const style: CSSStyleDeclaration = getComputedStyle(el);

    width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  /**
   * Returns the height of the element including paddings
   * @param el the element to which inner height will be calculated
   */
  getInnerHeight(el: HTMLElement): number {
    let height: number = el.offsetHeight;
    const style: CSSStyleDeclaration = getComputedStyle(el);

    height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return height;
  }

  /**
   * Returns the outer height of an element.
   * @param el the element to which height will be calculated
   * @param margin if set to true, it will add the margins to the returned height
   */
  getOuterHeight(el: HTMLElement, margin?: boolean): number {
    let height: number = el.offsetHeight;

    if (margin) {
      const style: CSSStyleDeclaration = getComputedStyle(el);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }

    return height;
  }

  /**
   * Returns the intrinsic height of an element without padding and border.
   * @param el
   */
  getHeight(el: HTMLElement): number {
    let height: number = el.offsetHeight;
    const style: CSSStyleDeclaration = getComputedStyle(el);

    height -=
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth);

    return height;
  }

  /**
   * Returns the intrinsic width of an element without padding and border.
   * @param el
   */
  getWidth(el: HTMLElement): number {
    let width: number = el.offsetWidth;
    const style: CSSStyleDeclaration = getComputedStyle(el);

    width -=
      parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight) +
      parseFloat(style.borderLeftWidth) +
      parseFloat(style.borderRightWidth);

    return width;
  }

  /**
   * Returns the view port dimensions
   */
  getViewport(): {width: number, height: number} {
    const win: Window = window;
    const d: Document = document;
    const e: HTMLElement = d.documentElement;
    const g: HTMLBodyElement = d.getElementsByTagName('body')[0];
    const w: number = win.innerWidth || e.clientWidth || g.clientWidth;
    const h: number = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  /**
   * Returns an oject with top and left distances between the
   * given element and the documents's very origin at (0,0)
   * @param el
   */
  getOffset(el: HTMLElement): {top: number, left: number} {
    const rect: ClientRect | DOMRect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    };
  }

  /**
   * Value of the user-agent header sent by the browser to the server
   */
  getUserAgent(): string {
    return navigator.userAgent;
  }

  /**
   * Whether the navigator is Internet Explorer or Edge.
   */
  isIE(): boolean {
    const ua: string = window.navigator.userAgent;
    const msie: number = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older
      return true;
    }
    const trident: number = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11
      return true;
    }
    const edge: number = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+)
      return true;
    }
    // other browser
    return false;
  }

  /**
   * Appends an element to a parent target. It accepts vanilla
   * html elements or component instances with public element refs
   * @param element
   * @param target
   */
  appendChild(element: any, target: any): void {
    if (this.isElement(target)) {
      target.appendChild(element);
    } else if (target.el && target.el.nativeElement) {
      target.el.nativeElement.appendChild(element);
    } else {
      throw new Error(`Cannot append ${target} to ${element}`);
    }
  }

  /**
   * Removes a child element from a parent target. It accepts vanilla
   * html elements or component instances with public element refs
   * @param element
   * @param target
   */
  removeChild(element: any, target: any): void {
    if (this.isElement(target)) {
      target.removeChild(element);
    } else if (target.el && target.el.nativeElement) {
      target.el.nativeElement.removeChild(element);
    } else {
      throw new Error(`Cannot remove ${element} from ${target}`);
    }
  }

  /**
   * Whether the given object is an html element
   * @param obj
   */
  isElement(obj: any): boolean {
    return typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj &&
          typeof obj === 'object' &&
          obj !== null &&
          obj.nodeType === 1 &&
          typeof obj.nodeName === 'string';
  }

  /**
   * Appends a div to the body and use it to calculates the scrollbar width.
   */
  calculateScrollBarWidth(): number {
    if (this.calculatedScrollBarWidth !== null) {
      return this.calculatedScrollBarWidth;
    }

    const scrollDiv: HTMLDivElement = document.createElement('div');
    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';

    document.body.appendChild(scrollDiv);

    const scrollBarWidth: number = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollBarWidth = scrollBarWidth;
    return scrollBarWidth;
  }

  /**
   * Invoke the given method on given element with specified arguments
   * @param element
   * @param methodName
   * @param args
   */
  invokeElementMethod(element: any, methodName: string, args?: any[]): void {
    (element as any)[methodName].apply(element, args);
  }

  /**
   * Clears the range of text selected by the user
   */
  clearSelection(): void {
    const doc: any = document;
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (
        window.getSelection().removeAllRanges &&
        window.getSelection().rangeCount > 0 &&
        window
          .getSelection()
          .getRangeAt(0)
          .getClientRects().length > 0
      ) {
        window.getSelection().removeAllRanges();
      }
    } else if (doc['selection'] && doc['selection'].empty) {
      try {
        doc['selection'].empty();
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  /**
   * Returns the current browser name with its version
   */
  getBrowser(): any {
    if (!this.browser) {
      const matched: UserAgentInfo = this.resolveUserAgent();
      this.browser = {};

      if (matched.browser) {
        this.browser[matched.browser] = true;
        this.browser['version'] = matched.version;
      }

      if (this.browser['chrome']) {
        this.browser['webkit'] = true;
      } else if (this.browser['webkit']) {
        this.browser['safari'] = true;
      }
    }

    return this.browser;
  }

  /**
   * Identifies and returns the current user agent
   */
  resolveUserAgent(): UserAgentInfo {
    const ua: string = navigator.userAgent.toLowerCase();
    const secondElement: number = 2;
    const match: any[] | RegExpExecArray =
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf('compatible') < 0 &&
        /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];

    return {
      browser: match[1] || '',
      version: match[secondElement] || '0'
    };
  }

  /**
   * Whether or not the device has touch screen.
   */
  isTouchDevice(): boolean {
   return this.isTouchable;
  }
}
