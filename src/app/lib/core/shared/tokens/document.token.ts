import { InjectionToken } from '@angular/core';

/**
 * Injection token used to inject the document object.
 */
export const DOCUMENT_TOKEN: InjectionToken<Document> = new InjectionToken<Document>('document', {
  providedIn: 'root',
  factory: (): Document => document
});
