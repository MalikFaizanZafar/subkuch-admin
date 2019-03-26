import {
  Component,
  Input,
  QueryList,
  ContentChildren
} from '@angular/core';
import { IsGridRow } from './row';

@Component({
  selector: 'is-grid-footer-column-group',
  template: ``
})
export class IsGridFooterColumnGroup {

  /**
   * Whether the column group is frozen
   */
  @Input()
  frozen: boolean;

  /**
   * Rows contained within the column group
   */
  @ContentChildren(IsGridRow)
  rows: QueryList<IsGridRow>;
}
