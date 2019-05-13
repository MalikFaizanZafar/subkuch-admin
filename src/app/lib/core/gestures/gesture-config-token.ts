import { InjectionToken } from '@angular/core';

import { HammerOptions } from './gesture-annotations';

/**
 * Injection token that can be used to provide options to the Hammerjs instance.
 * More info at http://hammerjs.github.io/api/.
 */
export const IS_HAMMER_OPTIONS: InjectionToken<HammerOptions> = new InjectionToken<HammerOptions>('IS_HAMMER_OPTIONS');
