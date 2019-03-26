import { Subject } from 'rxjs/Subject';

/**
 * Represents a modal instance.
 * This is the returned type from the main .open service method
 *
 * @export
 */
export class IsModalRef {
  /**
   * Consturctor
   * @param onClose
   * @param instance
   */
  constructor( public onClose: Subject<any>, public instance: any ) {}
}
