import { Component, Input } from '@angular/core';
import { IsGrid } from '../grid';
import { IsGridColumn } from '../shared/index';

@Component({
  selector: '[isGridColumnFooters]',
  templateUrl: './footers.html',
  styleUrls: ['./footers.scss']
})
export class IsGridColumnFooters {
  /**
   * Creates an instance of IsGridColumnFooters.
   * @param dt
   */
  constructor(public dt: IsGrid) { }

  /**
   * Array of columns for the footer.
   */
  @Input('isGridColumnFooters')
  columns: IsGridColumn[];
}
