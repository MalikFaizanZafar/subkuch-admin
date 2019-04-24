import { Platform } from '@angular/cdk/platform';

import { IsResponsiveBreakpoints, LG, MD, SM, XS } from '../../constants';
import { PartialCSSStyleDeclaration } from '../types';

/**
 * Whether or not a value is numeric
 * @param value
 */
export function isNumber(value: any): value is number {
  return !isNaN(value) && isFinite(value);
}

/**
 * Whether or not a value is an object
 * @param value
 */
export function isObject(value: any): value is object {
  const type: any = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

/**
 * Map object properties
 * @param obj
 * @param props
 * @example <caption>Example usage of mapProperties method.</caption>
 * let obj = {name:'Alex', age:25};
 * mapProperties(obj,{name:'John'});
 * The above function will update the obj variable as
 * obj = {name:'John', age:25 }
 */
export function mapProperties(obj: object, props: object): void {
  const _props: any = props;
  const _obj: any = obj;
  for (const key in _props) {
    if (_props[key] !== undefined) {
      _obj[key] = _props[key];
    }
  }
}

/**
 * Whether or not the browser is IE.
 * @param platform
 */
export function isIEBrowser(platform: Platform): boolean {
  const ua: string = window.navigator.userAgent;
  return platform.TRIDENT || platform.EDGE || ua.indexOf('MSIE') !== -1;
}

/**
 * To be used to get the breakpoint for window size.
 */
export function responsiveScreenSize(): IsResponsiveBreakpoints {
  if (window.innerWidth <= XS) {
    return IsResponsiveBreakpoints.xs;
  } else if (window.innerWidth <= SM) {
    return IsResponsiveBreakpoints.sm;
  } else if (window.innerWidth <= MD) {
    return IsResponsiveBreakpoints.md;
  } else if (window.innerWidth <= LG) {
    return IsResponsiveBreakpoints.lg;
  } else {
    return IsResponsiveBreakpoints.xl;
  }
}

/**
 * Type guard that checks if a value is defined
 * @param value
 */
export function isDefined<T = any>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Converts style object to string
 * {
 *    backgroundColor: '#e0e0e0'
 * } => 'background-color: #e0e0e0;'
 * @param style
 */
export function styleObjectToString(style: PartialCSSStyleDeclaration): string {
  return Object.keys(style)
    .map((key: string) => {
      return `${camelCaseToDash(key)}: ${(style as any)[key]};`;
    })
    .join(' ');
}

/**
 * Converts camel case string to dash string
 * backgroundColor => background-color
 * @param input
 */
export function camelCaseToDash(input: string): string {
  return input.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}

/**
 * Returns a new date "without" the timezone offset.
 * For example, for a timezone of GMT-5:
 * Passing this date:
 * Fri Feb 16 2018 15:07:03 GMT-0500 (-05)
 * will return this date:
 * Fri Feb 16 2018 10:07:03 GMT-0500 (-05)
 *
 * This function will not mutate the original date
 * @param date - date on which the offset must be applied
 */
export function removeTimezoneOffset(date: Date): Date {
  const newDate: Date = new Date(date);
  newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
  return newDate;
}

/**
 * Checks if current operating system is Mac or not
 */
export function isMacOS(): boolean {
  return navigator.userAgent.indexOf('Mac OS X') !== -1;
}

/**
 * Finds closest element with given
 * selector from given element
 * @param element
 * @param selector
 */
export function getClosest(
  element: Node,
  selector: string | HTMLElement
): Node {
  let nodeElement: Node = element;
  for (; nodeElement && nodeElement !== document; nodeElement = nodeElement.parentNode) {
    if (typeof selector === 'string') {
      if ((nodeElement as HTMLElement).matches(selector)) {
        return nodeElement;
      }
    } else {
      if ((nodeElement as HTMLElement) === selector) {
        return nodeElement;
      }
    }
  }
  return null;
}

/**
 * Checks if a value, primitive or object
 * is null or undefined
 * @param value, any given value
 */
export function isNullOrUndefined<T>(
  value: T | null | undefined
): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/**
 * Whether or not given value is an empty string
 * @param val
 */
export function isEmptyString(val: any): val is string {
  return typeof val === 'string' && val.trim() === '';
}

/**
 * Whether or not a given value is a Date
 * @param val, any given value
 */
export function isDateType(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]';
}

/**
 * Get the array of properties from the dataset for a given field.
 * @param dataset
 * @param field
 */
export function getUniqueValues<F extends keyof T, T = any>(
  dataset: T[] | undefined | null,
  field: F
): Array<T[F]> {
  const arr: any[] = [];
  if (dataset) {
    let item: T;
    for (item of dataset) {
      if (arr.indexOf(item[field]) === -1) {
        arr.push(item[field]);
      }
    }
  }
  return arr;
}

/**
 * Same as Object.keys, but the return type is appropriately typed to the object's keys instead of string.
 */
export const typedObjectKeys: <T>(
  object: T
) => Array<keyof T> = Object.keys as any;
