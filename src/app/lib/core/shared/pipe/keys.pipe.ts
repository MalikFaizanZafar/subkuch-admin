import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns keys of piped
 * through it
 */
@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  /**
   * Pipe handler that transforms an object
   * into an array of its properties keys.
   * @param value
   * @param args
   */
  transform(value: any, args: any[] = null): any {
    return Object.keys(value);
  }
}
