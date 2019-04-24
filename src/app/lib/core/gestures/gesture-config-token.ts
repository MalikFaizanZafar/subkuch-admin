import { InjectionToken } from '@angular/core';

import { HammerOptions } from './gesture-annotations';

/**
 * Injection token that can be used to provide options to the Hammerjs instance.
 * More info at http://hammerjs.github.io/api/.
 */
export const DF_HAMMER_OPTIONS: InjectionToken<HammerOptions> = new InjectionToken<HammerOptions>('DF_HAMMER_OPTIONS');
