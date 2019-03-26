import { Component, Input } from '@angular/core';
import { IsGrid } from '../grid';
import { IsGridColumn } from '../shared/column';
import { slide } from '../../core/animations';

@Component({
  selector: '[isGridTableBody]',
  templateUrl: './table-body.html',
  styleUrls: ['./table-body.scss'],
  animations: [slide]
})
export class IsGridTableBody {
  constructor(public dt: IsGrid) {}

  /**
   * Body columns
   */
  @Input('isGridTableBody')
  columns: IsGridColumn[];

  /**
   * Grid data
   */
  @Input()
  data: any[];

  /**
   * Array of visible columns.
   */
  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden) : [];
  }

  /**
   * Whether the data cell is rowspan.
   * @param col
   * @param rowData
   * @param rowIndex
   */
  isRowSpan(col: IsGridColumn, rowData: any, rowIndex: number) {
    return this.dt.rowGroupMode === 'rowspan' &&
      this.dt.sortField === col.field &&
      this.dt.rowGroupMetadata[
        this.dt.resolveFieldData(rowData, this.dt.sortField)
      ].index === rowIndex
      ? this.dt.rowGroupMetadata[
          this.dt.resolveFieldData(rowData, this.dt.sortField)
        ].size
      : null;
  }

  /**
   * Whether the table data is a single cell.
   * @param col
   * @param rowData
   * @param rowIndex
   */
  isCell(col: IsGridColumn, rowData: any, rowIndex: number) {
    return (
      !this.dt.rowGroupMode ||
      this.dt.rowGroupMode === 'subheader' ||
      (this.dt.rowGroupMode === 'rowspan' &&
        ((this.dt.sortField === col.field &&
          this.dt.rowGroupMetadata[
            this.dt.resolveFieldData(rowData, this.dt.sortField)
          ].index === rowIndex) ||
          this.dt.sortField !== col.field))
    );
  }

  /**
   * Whether the row is a row group element.
   * @param rowData
   * @param rowIndex
   */
  isRowGroupElement(rowData: any, rowIndex: number) {
    return (
      this.dt.rowGroupMode === 'subheader' &&
      (rowIndex === 0 ||
        this.dt.resolveFieldData(rowData, this.dt.groupField) !==
          this.dt.resolveFieldData(
            this.dt.dataToRender[rowIndex - 1],
            this.dt.groupField
          ))
    );
  }

  /**
   * Whether the row group has a footer.
   * @param rowData
   * @param rowIndex
   */
  hasRowGroupFooter(rowData: any, rowIndex: number) {
    return (
      this.dt.rowGroupFooterTemplate &&
      (this.dt.rowGroupMode === 'subheader') &&
      ((rowIndex === this.dt.dataToRender.length - 1) ||
        this.dt.resolveFieldData(rowData, this.dt.groupField) !==
          this.dt.resolveFieldData(this.dt.dataToRender[rowIndex + 1], this.dt.groupField)) &&
      (!this.dt.expandableRowGroups || this.dt.isRowGroupExpanded(rowData))
    );
  }
}
