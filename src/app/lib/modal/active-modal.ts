/**
 * This class models an instance of the active modal
 *
 * @export
 */
export class IsActiveModal {

  /**
   * An active modal can carry an optional payload which you can use to receive data
   * from its source via DI
   *
   * @memberof IsActiveModal
   */
  data: any;

  /**
   * Can be used to close a modal. An optional result can be passed as a parameter
   *
   * @param [result]
   * @memberof IsActiveModal
   */
  close(result?: any) {}
}
