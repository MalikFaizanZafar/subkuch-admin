import { Subject } from 'rxjs';

/**
 * Represents a modal instance.
 * This is the returned type from the main .open service method
 */
export class IsPortalRef<T = any> {
  /**
   * Creates instance of IsPortalRef
   * @param onClose subject emitted when the portal is closed
   * @param instance portal instance
   */
  constructor(
    public onClose: Subject<any>,
    public instance: T
  ) {}
}
