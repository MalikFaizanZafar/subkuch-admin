import { Injectable } from '@angular/core';

/**
 * This class defines and exposes several utilities to easily interact with the DOM
 */
@Injectable()
export class DomHandler {
  /**
   * An arbitrary zindex value
   */
  public static zindex = 1000;

  /**
   * Helper variable to hold the scroll bar witdh
   */
  private calculatedScrollBarWidth: number = null;

  /**
   * Cache for browser evaluation
   */
  private browser: any;

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
      element.className += ' ' + className;
    }
  }

  /**
   * Adds classes to a dom element. Adds the classes to the classList if it exist otherwise adds to the className attribute.
   * @param element
   * @param className
   */
  addMultipleClasses(element: any, className: string): void {
    if (element.classList) {
      const styles: string[] = className.split(' ');
      for (let i = 0; i < styles.length; i++) {
        element.classList.add(styles[i]);
      }
    } else {
      const styles: string[] = className.split(' ');
      for (let i = 0; i < styles.length; i++) {
        element.className += ' ' + styles[i];
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
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
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
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(
        element.className
      );
    }
  }

  /**
   * Returns the siblings of a given element
   */
  siblings(element: HTMLElement): any {
    return Array.prototype.filter.call((element.parentNode as HTMLElement).children, function(
      child
    ) {
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
   * Returns the first element that is a descendant of the element on which it is invoked that matches the specified group of selectors.
   * @param element
   * @param selector
   */
  findSingle(element: any, selector: string): any {
    return element.querySelector(selector);
  }

  /**
   * Returns the position index of the given element among its siblings
   */
  index(element: HTMLElement): number {
    const children = element.parentNode.childNodes;
    let num = 0;
    for (let i = 0; i < children.length; i++) {
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
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const targetHeight = target.offsetHeight;
    const targetWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const viewport = this.getViewport();
    let top, left;

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

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  /**
   * Get absolute position of an element with respect to target.
   * @param element
   * @param target
   */
  absolutePosition(element: any, target: any): void {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : this.getHiddenElementDimensions(element);
    const elementOuterHeight = elementDimensions.height;
    const elementOuterWidth = elementDimensions.width;
    const targetOuterHeight = target.offsetHeight;
    const targetOuterWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = this.getWindowScrollTop();
    const windowScrollLeft = this.getWindowScrollLeft();
    const viewport = this.getViewport();
    let top, left;

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

    element.style.top = top + 'px';
    element.style.left = left + 'px';
  }

  /**
   * Returns the outer height of a hidden element
   */
  getHiddenElementOuterHeight(element: any): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementHeight = element.offsetHeight;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementHeight;
  }

  /**
   * Returns the outer width of a hidden element
   */
  getHiddenElementOuterWidth(element: HTMLElement): number {
    element.style.visibility = 'hidden';
    element.style.display = 'block';
    const elementWidth = element.offsetWidth;
    element.style.display = 'none';
    element.style.visibility = 'visible';

    return elementWidth;
  }

  /**
   * Returns the dimensions of a hidden element
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
   */
  scrollInView(container: HTMLElement, item: HTMLElement) {
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
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset =
      itemRect.top +
      document.body.scrollTop -
      (containerRect.top + document.body.scrollTop) -
      borderTop -
      paddingTop;
    const scroll = container.scrollTop;
    const elementHeight = container.clientHeight;
    const itemHeight = this.getOuterHeight(item);

    if (offset < 0) {
      container.scrollTop = scroll + offset;
    } else if (offset + itemHeight > elementHeight) {
      container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
  }

  /**
   * Fades in an element within the timeframe specified by 'duration'
   */
  fadeIn(element: HTMLElement, duration: number): void {
    element.style.opacity = '0';

    let last = +new Date();
    let opacity = 0;
    const tick = function() {
      opacity =
        +element.style.opacity.replace(',', '.') +
        (new Date().getTime() - last) / duration;
      element.style.opacity = opacity.toString();
      last = +new Date();

      if (+opacity < 1) {
        if (!(window.requestAnimationFrame && requestAnimationFrame(tick))) {
          setTimeout(tick, 16);
        }
      }
    };

    tick();
  }

  /**
   * Fades out an element within the timeframe specified by 'ms'
   */
  fadeOut(element: HTMLElement, ms: number) {
    let opacity = 1;
    const interval = 50,
      duration = ms,
      gap = interval / duration;

    const fading = setInterval(() => {
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
    const doc = document.documentElement;
    return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }

  /**
   * Returns the number of scrolled pixels from the left
   */
  getWindowScrollLeft(): number {
    const doc = document.documentElement;
    return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  }

  /**
   * Whether or not the element would be selected by the specified selector string
   */
  matches(element: HTMLElement, selector: string): boolean {
    const p = Element.prototype;
    const f =
      p['matches'] ||
      p.webkitMatchesSelector ||
      p['mozMatchesSelector'] ||
      p.msMatchesSelector ||
      function(s) {
        return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
      };
    return f.call(element, selector);
  }

  /**
   * Returns the outer width of an element.
   * @param el the element to which width will be calculated
   * @param margin if set to true, it will add the margins to the returned height
   */
  getOuterWidth(el: HTMLElement, margin?: boolean) {
    let width = el.offsetWidth;

    if (margin) {
      const style = getComputedStyle(el);
      width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }

    return width;
  }

  /**
   * Returns the horizontal paddings of an element
   */
  getHorizontalPadding(el: HTMLElement) {
    const style = getComputedStyle(el);
    return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  /**
   * Returns the horizontal margins of an element
   */
  getHorizontalMargin(el: HTMLElement) {
    const style = getComputedStyle(el);
    return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  }

  /**
   * Returns the element's width with paddings
   */
  innerWidth(el: HTMLElement) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  /**
   * Returns the element's width without paddings
   */
  width(el: HTMLElement) {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

    width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return width;
  }

  /**
   * Returns the height of the element including paddings
   */
  getInnerHeight(el: HTMLElement) {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return height;
  }

  /**
   * Returns the outer height of an element.
   * @param el the element to which height will be calculated
   * @param margin if set to true, it will add the margins to the returned height
   */
  getOuterHeight(el: HTMLElement, margin?: boolean) {
    let height = el.offsetHeight;

    if (margin) {
      const style = getComputedStyle(el);
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    }

    return height;
  }

  /**
   * Returns the intrinsic height of an element without padding and border.
   */
  getHeight(el: HTMLElement): number {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height -=
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth);

    return height;
  }

  /**
   * Returns the intrinsic width of an element without padding and border.
   */
  getWidth(el: HTMLElement): number {
    let width = el.offsetWidth;
    const style = getComputedStyle(el);

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
    const win = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      w = win.innerWidth || e.clientWidth || g.clientWidth,
      h = win.innerHeight || e.clientHeight || g.clientHeight;

    return { width: w, height: h };
  }

  /**
   * Returns an oject with top and left distances between the
   * given element and the documents's very origin at (0,0)
   */
  getOffset(el: HTMLElement): {top: number, left: number} {
    const rect = el.getBoundingClientRect();

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
  isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older
      return true;
    }
    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11
      return true;
    }
    const edge = ua.indexOf('Edge/');
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
   */
  appendChild(element: any, target: any) {
    if (this.isElement(target)) {
      target.appendChild(element);
    } else if (target.el && target.el.nativeElement) {
      target.el.nativeElement.appendChild(element);
    } else {
      throw new Error('Cannot append ' + target + ' to ' + element);
    }
  }

  /**
   * Removes a child element from a parent target. It accepts vanilla
   * html elements or component instances with public element refs
   */
  removeChild(element: any, target: any) {
    if (this.isElement(target)) {
      target.removeChild(element);
    } else if (target.el && target.el.nativeElement) {
      target.el.nativeElement.removeChild(element);
    } else {
      throw new Error('Cannot remove ' + element + ' from ' + target);
    }
  }

  /**
   * Whether the given object is an html element
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

    const scrollDiv = document.createElement('div');
    scrollDiv.style.width = '100px';
    scrollDiv.style.height = '100px';
    scrollDiv.style.overflow = 'scroll';
    scrollDiv.style.position = 'absolute';
    scrollDiv.style.top = '-9999px';

    document.body.appendChild(scrollDiv);

    const scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    this.calculatedScrollBarWidth = scrollBarWidth;
    return scrollBarWidth;
  }

  invokeElementMethod(element: any, methodName: string, args?: any[]): void {
    (element as any)[methodName].apply(element, args);
  }

  /**
   * Clears the range of text selected by the user
   */
  clearSelection(): void {
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
    } else if (document['selection'] && document['selection'].empty) {
      try {
        document['selection'].empty();
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * Returns the current browser name with its version
   */
  getBrowser() {
    if (!this.browser) {
      const matched = this.resolveUserAgent();
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
  resolveUserAgent() {
    const ua = navigator.userAgent.toLowerCase();
    const match =
      /(chrome)[ \/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      (ua.indexOf('compatible') < 0 &&
        /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
      [];

    return {
      browser: match[1] || '',
      version: match[2] || '0'
    };
  }
}
