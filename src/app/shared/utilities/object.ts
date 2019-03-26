/**
 * Clones object and returns exact copy of it.
 *
 * @param object Source object
 *
 * @since 1.0.0 ( MVP )
 */
export function cloneObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}
