import { InjectionToken } from '@angular/core';
import { IsPortalOptions } from './portal-options';

/**
 * Injection token used to inject IsPortal configuration options
 */
export const PORTAL_CONFIG = new InjectionToken<IsPortalOptions>('portal.config');
