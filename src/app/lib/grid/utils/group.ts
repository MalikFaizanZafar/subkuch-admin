import { EventEmitter } from '@angular/core';
import { ObjectUtils, IsGridRowExpandMode } from '../utils/index';

export class IsGridGroupHandler {
  expandedRows: any[];
  expandedRowsGroups: any[];
  rowGroupToggleClick: boolean;
  rowExpandMode: IsGridRowExpandMode = 'multiple';
  rowGroupExpandMode: IsGridRowExpandMode = 'multiple';
  groupField: string;

  constructor(
    private rowCollapse: EventEmitter<any> = new EventEmitter<any>(),
    private rowExpand: EventEmitter<any> = new EventEmitter<any>(),
    private rowGroupCollapse: EventEmitter<any> = new EventEmitter<any>(),
    private rowGroupExpand: EventEmitter<any> = new EventEmitter<any>(),
    public objectUtils: ObjectUtils
  ) {}

  findExpandedRowIndex(row: any): number {
    let index = -1;
    if (this.expandedRows) {
      for (let i = 0; i < this.expandedRows.length; i++) {
        if (this.expandedRows[i] === row) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  toggleRow(row: any, event?: Event) {
    if (!this.expandedRows) {
      this.expandedRows = [];
    }

    const expandedRowIndex = this.findExpandedRowIndex(row);

    if (expandedRowIndex !== -1) {
      this.expandedRows.splice(expandedRowIndex, 1);
      this.rowCollapse.emit({
        originalEvent: event,
        data: row
      });
    } else {
      if (this.rowExpandMode === 'single') {
        this.expandedRows = [];
      }

      this.expandedRows.push(row);
      this.rowExpand.emit({
        originalEvent: event,
        data: row
      });
    }

    if (event) {
      event.preventDefault();
    }
  }

  findExpandedRowGroupIndex(row: any): number {
    let index = -1;
    if (this.expandedRowsGroups && this.expandedRowsGroups.length) {
      for (let i = 0; i < this.expandedRowsGroups.length; i++) {
        const group = this.expandedRowsGroups[i];
        const rowGroupField = this.objectUtils.resolveFieldData(
          row,
          this.groupField
        );
        if (rowGroupField === group) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  toggleRowGroup(event: Event, row: any): void {
    if (!this.expandedRowsGroups) {
      this.expandedRowsGroups = [];
    }

    this.rowGroupToggleClick = true;
    const index = this.findExpandedRowGroupIndex(row);
    const rowGroupField = this.objectUtils.resolveFieldData(
      row,
      this.groupField
    );
    if (index >= 0) {
      this.expandedRowsGroups.splice(index, 1);
      this.rowGroupCollapse.emit({
        originalEvent: event,
        group: rowGroupField
      });
    } else {
      if (this.rowGroupExpandMode === 'single') {
        this.expandedRowsGroups = [];
      }

      this.expandedRowsGroups.push(rowGroupField);
      this.rowGroupExpand.emit({
        originalEvent: event,
        group: rowGroupField
      });
    }
    event.preventDefault();
  }
}
