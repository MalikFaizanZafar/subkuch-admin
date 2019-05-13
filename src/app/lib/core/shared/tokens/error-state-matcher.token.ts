import { InjectionToken } from '@angular/core';

import { IsErrorStateMatcher } from '../model/error-state-matcher';

/**
 * Injection token for default error state matcher service
 */
export const IS_ERROR_STATE_MATCHER: InjectionToken<IsErrorStateMatcher> = new InjectionToken('is-error-state-matcher');
