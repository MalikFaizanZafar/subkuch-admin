import { InjectionToken } from '@angular/core';
import { IsBaseToastOptions } from './toast-base-options';

/**
 * Injection token used to inject IsToast configuration options
 */
export let TOAST_CONFIG = new InjectionToken<IsBaseToastOptions>('toast.config');
