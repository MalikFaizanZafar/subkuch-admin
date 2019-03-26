import {
  Component,
  QueryList,
  ContentChildren,
} from '@angular/core';

import { IsGridColumn } from './column';

@Component({
  selector: 'is-grid-row',
  template: ``
})
export class IsGridRow {

  /**
   * Columns contained within this row
   */
  @ContentChildren(IsGridColumn)
  columns: QueryList<IsGridColumn>;
}
