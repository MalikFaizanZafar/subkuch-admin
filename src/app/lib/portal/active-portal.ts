/**
 * This class models an instance of the active portal
 *
 * @export
 */
export class IsActivePortal<D = any, R = any> {

  /**
   * An active portal can carry an optional payload which you can use to receive data
   * from its source via DI
   *
   * @memberof IsActivePortal
   */
  data: D;

  /**
   * Can be used to close a portal. An optional result can be passed as a parameter
   *
   * @param [result]
   * @memberof IsActivePortal
   */
  close(result?: R) {}
}
