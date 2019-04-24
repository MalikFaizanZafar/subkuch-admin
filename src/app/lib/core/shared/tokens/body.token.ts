import { InjectionToken } from '@angular/core';

/**
 * Injection token used to inject the document body
 */
export const BODY_TOKEN: InjectionToken<HTMLElement> = new InjectionToken<HTMLElement>('document.body', {
  providedIn: 'root',
  factory: (): HTMLElement => document.body
});
