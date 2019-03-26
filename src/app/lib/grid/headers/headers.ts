import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { IsGrid } from '../grid';
import { IsGridColumn } from '../shared/index';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '[isGridColumnHeaders]',
  templateUrl: './headers.html',
  styleUrls: ['./headers.scss']
})
export class IsGridColumnHeaders {

  /**
   * Popover view child
   */
  @ViewChildren('popover')
  popovers: QueryList<NgbPopover>;

  constructor(public dt: IsGrid) {}

  /**
   * Columns to render as headers
   */
  @Input('isGridColumnHeaders')
  columns: IsGridColumn[];

  /**
   * Returns an array of open popovers
   */
  openPopovers() {
    return this.popovers.toArray().filter(p => p.isOpen());
  }

  /**
   * Close all the popovers
   */
  closeAllPopovers() {
    this.openPopovers().forEach(element => {
      element.close();
    });
  }

  /**
   * Checks if current column is filtered or not
   * @param col
   */
  isPropertyFiltered(col: IsGridColumn) {
    return this.dt.filters.hasOwnProperty(col.filterField) || this.dt.filters.hasOwnProperty(col.field);
  }

  /**
   * Get Unique values for a column
   * @param col
   */
  uniqueValues(col: IsGridColumn) {
    return this.dt.uniqueValues(col.field);
  }

  /**
   * Callback method on filter input change.
   */
  filterChanged(event, col) {
    const values = [];
    Object.keys(event).forEach(property => {
      if (event[property] && property !== '_filterInput') {
        values.push(property);
      }
    });
    this.dt.filter(values, col.field, col.filterMatchMode, event['_filterInput'] );
  }

  /**
   * Callback function on lock button click event. Adds or removes an item from the frozenColumn array.
   * @param col
   */
  lockChange(col: IsGridColumn, evt: Event) {
    const width = this.dt.domHandler.width((evt.target as HTMLElement).parentElement.parentElement);
    col.frozen = !col.frozen;
    let offset;
    if (col.frozen) {
      this.dt.frozenColumns.push(col);
      const ind = this.dt.scrollableColumns.findIndex(sc => sc === col);
      if (ind !== -1) {
        this.dt.scrollableColumns.splice(ind, 1);
      }
      offset = width;
    } else {
      this.dt.scrollableColumns.push(col);
      const ind = this.dt.frozenColumns.findIndex(sc => sc === col);
      if (ind !== -1) {
        this.dt.frozenColumns.splice(ind, 1);
      }
      offset = -width;
    }
    this.dt.frozenWidth = parseFloat(this.dt.frozenWidth) + offset + 'px';
  }

  /**
   * Whether to show the resizer thumb in a given column
   * @param col - column where the thumb should render
   * @param lastCol - whether or not this is the last column
   * @returns - true if the thumb must be shown, false otherwise
   */
  shouldRenderResizer(col: IsGridColumn, lastCol: boolean): boolean {
    return this.dt.resizableColumns &&
      col.resizable &&
      ((this.dt.columnResizeMode === 'fit' && !lastCol) ||
        this.dt.columnResizeMode === 'expand');
  }

  /**
   * Return the filter values for a given column
   */
  getColumnFilterValues(col: IsGridColumn) {
    const colFilter = this.dt.filters[col.filterField || col.field];
    return colFilter ? colFilter.value : '';
  }

  /**
   * Returns the filter input value of a given column
   */
  getColumnFilterInputValue(col: IsGridColumn) {
    const colFilter = this.dt.filters[col.filterField || col.field];
    return colFilter ? colFilter.inputValue : '';
  }

  /**
   * Returns the a11y scope to apply to the table
   */
  getColumnA11yScope(col: IsGridColumn): string {
    return col.scope || (col.colspan ? 'colgroup' : 'col');
  }
}
