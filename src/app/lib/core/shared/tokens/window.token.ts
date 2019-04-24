import { InjectionToken } from '@angular/core';

/**
 * Injection token used to inject the global Window object
 */
export const WINDOW_TOKEN: InjectionToken<Window> = new InjectionToken<Window>('window');
