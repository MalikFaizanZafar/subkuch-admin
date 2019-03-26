/**
 * Whether or not a value is numeric
 * @param value
 */
export function isNumber( value: any ): value is number {
  return !isNaN(value) && isFinite(value);
}

/**
 * Whether or not a value is an object
 * @param value
 */
export function isObject( value ): value is Object {
  const type = typeof value;
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
export function mapProperties( obj: Object, props: Object ) {
  for (const key in props) {
    if (props[key] !== undefined) {
      obj[key] = props[key];
    }
  }
}

/**
 * Whether or not the browser is IE.
 */
export function isIEBrowser( platform ): boolean {
  const ua = window.navigator.userAgent;
  return platform.TRIDENT ||
    platform.EDGE ||
    ua.indexOf('MSIE') !== -1;
}
