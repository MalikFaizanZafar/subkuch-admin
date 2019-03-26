import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: string[], filter: string): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => item !== filter);
  }
}
