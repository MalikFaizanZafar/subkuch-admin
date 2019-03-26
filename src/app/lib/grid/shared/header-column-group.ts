import {
  Component,
  Input,
  QueryList,
  ContentChildren
} from '@angular/core';
import { IsGridRow } from './row';

@Component({
  selector: 'is-grid-header-column-group',
  template: ``
})
export class IsGridHeaderColumnGroup {

  /**
   * Whether the column group is frozen
   */
  @Input() frozen: boolean;

  /**
   * Rows contained within the column group
   */
  @ContentChildren(IsGridRow)
  rows: QueryList<IsGridRow>;
}
