import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filters out strings from given
 * array that doesn't match given filter
 * @example {{ ['abc', 'xyz'] | filter : 'xyz' }} => ['abc']
 */
@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  /**
   * Pipe handler that returns an array of strings
   * based on the filter supplied.
   * @param items
   * @param filter
   */
  transform(items: string[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item: string) => item !== filter);
  }
}
