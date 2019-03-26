import { IsGrid } from './grid';
import { ChangeDetectorRef } from '@angular/core';

export class IsGridManager {

  /**
   * Constructor method injects grid reference
   * @param grid
   */
  constructor(private grid: IsGrid,
              private changeDetector: ChangeDetectorRef) { }
  /**
   * Handles data change to update paginator, virtual scroll, and sort functionality.
   */
  handleDataChange() {
    if (this.grid.paginator) {
      this.grid.updatePaginator();
    }

    if (this.grid.virtualScroll && this.grid.virtualScrollCallback) {
      this.grid.virtualScrollCallback();
    }

    if (!this.grid.lazy) {
      if (this.grid.filterHandler.hasFilter()) {
        this.grid._filter(false);
      }

      if (this.grid.sortHandler.preventSortPropagation) {
        this.grid.sortHandler.preventSortPropagation = false;
      } else if (this.grid.sortField || this.grid.multiSortMeta) {
        if (!this.grid.sortHandler.sortColumn && this.grid.columns) {
          this.grid.sortHandler.sortColumn = this.grid.columns.find(
            col => col.field === this.grid.sortField && col.sortable === 'custom'
          );
        }

        if (this.grid.sortMode === 'single') {
          this.grid.sortSingle();
        } else if (this.grid.sortMode === 'multiple') {
          this.grid.sortMultiple();
        }
      }
    }

    this.updateDataToRender(this.grid.filterHandler.filteredValue || this.grid.value);
  }

  /**
   * Updates row group metadata according to the sortField
   */
  updateRowGroupMetadata() {
    this.grid.rowGroupMetadata = {};
    if (this.grid.dataToRender) {
      for (let i = 0; i < this.grid.dataToRender.length; i++) {
        const rowData = this.grid.dataToRender[i];
        const group = this.grid.resolveFieldData(rowData, this.grid.sortField);
        if (i === 0) {
          this.grid.rowGroupMetadata[group] = { index: 0, size: 1 };
        } else {
          const previousRowData = this.grid.dataToRender[i - 1];
          const previousRowGroup = this.grid.resolveFieldData(
            previousRowData,
            this.grid.sortField
          );
          if (group === previousRowGroup) {
            this.grid.rowGroupMetadata[group].size++;
          } else {
            this.grid.rowGroupMetadata[group] = { index: i, size: 1 };
          }
        }
      }
    }
  }

  /**
   * Updates data to render in the grid.
   * @param datasource
   */
  updateDataToRender(datasource: any[]) {
    if ((this.grid.paginator || this.grid.virtualScroll) && datasource) {
      this.grid.dataToRender = [];
      const startIndex: number = this.grid.lazy ? 0 : this.grid.first;
      const endIndex: number = this.grid.virtualScroll
        ? this.grid.first + this.grid.rows * 2
        : startIndex + this.grid.rows;
      for (let i = startIndex; i < endIndex; i++) {
        if (i >= datasource.length) {
          break;
        }

        this.grid.dataToRender.push(datasource[i]);
      }
    } else {
      this.grid.dataToRender = datasource;
    }

    if (this.grid.rowGroupMode) {
      this.updateRowGroupMetadata();
    }
    this.changeDetector.markForCheck();
  }

  /**
   * Reset table status. Remove sorts and filters.
   */
  reset() {
    this.grid.sortHandler.reset();
    this.grid.filterHandler.reset();

    this.grid.filters = {};

    this.grid._first = 0;
    this.grid.firstChange.emit(this.grid._first);
    this.grid.updateTotalRecords();

    if (this.grid.lazy) {
      this.grid.lazyLoad.emit(this.grid.createLazyLoadMetadata());
    } else {
      this.updateDataToRender(this.grid.value);
    }
  }

  /**
   * Whether or not the grid has a footer.
   */
  hasFooter() {
    if (this.grid.footerColumnGroups && this.grid.footerColumnGroups.first) {
      return true;
    } else {
      if (this.grid.columns) {
        for (let i = 0; i < this.grid.columns.length; i++) {
          if (this.grid.columns[i].footer || this.grid.columns[i].footerTemplate) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Sets the width of the columns and handles colGroup accordingly.
   */
  fixColumnWidths() {
    const columns = this.grid.domHandler.find(
      this.grid.el.nativeElement,
      'th.is-grid-column--resizable'
    );
    let bodyCols;

    for (let i = 0; i < columns.length; i++) {
      columns[i].style.width = columns[i].offsetWidth + 'px';
    }

    if (this.grid.scrollable) {
      const colGroup = this.grid.domHandler.findSingle(
        this.grid.el.nativeElement,
        'colgroup.is-grid-scrollable-colgroup'
      );
      bodyCols = colGroup.children;

      if (bodyCols) {
        for (let i = 0; i < bodyCols.length; i++) {
          bodyCols[i].style.width = columns[i].offsetWidth + 'px';
        }
      }
    }
  }

}
