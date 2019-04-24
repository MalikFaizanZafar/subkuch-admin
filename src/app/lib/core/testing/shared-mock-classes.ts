import { Observable, of } from 'rxjs';

import { BreakpointState } from '@angular/cdk/layout';

/**
 * Mocked breakpoint observer used for desktop.
 */
export class MockDesktopBreakpointObserver {

  /**
   * Mocks observe method of BreakPointObserver to simulate desktop environment
   * @param value
   */
  observe( value: string | string[] ): Observable<BreakpointState> {
    return of({ matches: false} as BreakpointState);
  }
}

/**
 * Mocked breakpoint observer used for mobile screens.
 */
export class MockMobileBreakpointObserver {

  /**
   * Mocks observe method of BreakPointObserver to simulate mobile environment
   * @param value
   */
  observe( value: string | string[] ): Observable<BreakpointState> {
    return of({ matches: true} as BreakpointState);
  }
}
