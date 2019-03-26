import { IsGridColumn } from '../shared/column';
import { ObjectUtils } from '../utils/object-utils';
import { IsGridSortMeta, IsGridSortMode } from '../utils/models/index';

/**
 * Helper class that manages the sorting feature on the grid
 */
export class IsGridSortHandler {

  /**
   * Column to sort
   */
  sortColumn: IsGridColumn;

  /**
   * Metadata used when 'multiple' sorting mode is enabled
   */
  multiSortMeta: IsGridSortMeta[];

  /**
   * Represents the data field used to sort the data
   */
  sortField: string;

  /**
   * Whether to sort in ascending (1) or descending order (-1)
   */
  sortOrder = 1;

  /**
   * Default sort order
   */
  defaultSortOrder = 1;

  /**
   * Defines whether sorting works on single column or on multiple columns.
   */
  sortMode: IsGridSortMode = 'single';

  /**
   * Whether or not to prevent the sort click event propagation
   */
  preventSortPropagation: boolean;

  /**
   * Creates an instance of IsGridSortHandler.
   */
  constructor(public objectUtils: ObjectUtils) {}

  /**
   * Sorts the data based on the values of one column
   * @param event Mouse event
   * @param column Column from which the sorting will be based on
   * @param value Grid data
   * @param immutable Indicates whether the event should be propagated
   * @param lazy Whether or not the data in grid is being lazy loaded
   */
  sort(event: MouseEvent, column: IsGridColumn, value: any[], immutable: boolean, lazy: boolean) {

      if (!immutable) {
        this.preventSortPropagation = true;
      }

      const columnSortField = column.sortField || column.field;
      this.sortOrder =
        this.sortField === columnSortField
          ? this.sortOrder * -1
          : this.defaultSortOrder;
      this.sortField = columnSortField;
      this.sortColumn = column;
      const metaKey = event.metaKey || event.ctrlKey;

      if (this.sortMode === 'multiple') {
        if (!this.multiSortMeta || !metaKey) {
          this.multiSortMeta = [];
        }

        this.addSortMeta({ field: this.sortField, order: this.sortOrder });
      }
      if (!lazy) {
        if (this.sortMode === 'multiple') {
          this.sortMultiple(value);
        } else {
          this.sortSingle(value);
        }
      }
  }

  /**
   * Sort the grid in 'single' mode, it means that the sorting will be based on
   * one column only
   * @param value Grid data
   */
  sortSingle(value: any[]) {
      if (this.sortColumn && this.sortColumn.sortable === 'custom') {
        this.preventSortPropagation = true;
        this.sortColumn.sort.emit({
          field: this.sortField,
          order: this.sortOrder
        });
      } else {
        value.sort((data1, data2) => {
          const value1 = this.objectUtils.resolveFieldData(
            data1,
            this.sortField
          );
          const value2 = this.objectUtils.resolveFieldData(
            data2,
            this.sortField
          );
          let result = null;

          if (value1 == null && value2 != null) {
            result = -1;
          } else if (value1 != null && value2 == null) {
            result = 1;
          } else if (value1 == null && value2 == null) {
            result = 0;
          } else if (typeof value1 === 'string' && typeof value2 === 'string') {
            result = value1.localeCompare(value2);
          } else {
            result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
          }

          return this.sortOrder * result;
        });
      }
  }

  /**
   * Sort the grid in 'multiple' mode, it means that the sorting will be based on
   * multiple columns
   * @param value Grid data
   */
  sortMultiple(value: any[]) {
      value.sort((data1, data2) => {
        return this.multisortField(data1, data2, this.multiSortMeta, 0);
      });
  }

  /**
   * Sorts a row according to a sorting metadata
   */
  multisortField(data1: any, data2: any, multiSortMeta: IsGridSortMeta[], index: number) {
    const value1 = this.objectUtils.resolveFieldData(
      data1,
      multiSortMeta[index].field
    );
    const value2 = this.objectUtils.resolveFieldData(
      data2,
      multiSortMeta[index].field
    );
    let result = null;

    if (typeof value1 === 'string' || value1 instanceof String) {
      if (value1.localeCompare && value1 !== value2) {
        return multiSortMeta[index].order * value1.localeCompare(value2);
      }
    } else {
      result = value1 < value2 ? -1 : 1;
    }

    if (value1 === value2) {
      return multiSortMeta.length - 1 > index
        ? this.multisortField(data1, data2, multiSortMeta, index + 1)
        : 0;
    }

    return multiSortMeta[index].order * result;
  }

  /**
   * Adds sortmetada to the multisortmeta
   * @param meta
   */
  addSortMeta(meta: IsGridSortMeta) {
    let index = -1;
    for (let i = 0; i < this.multiSortMeta.length; i++) {
      if (this.multiSortMeta[i].field === meta.field) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      this.multiSortMeta[index] = meta;
    } else {
      this.multiSortMeta.push(meta);
    }
  }

  /**
   * Whether or not the given column is sorted
   */
  isSorted(column: IsGridColumn): boolean {
    if (!column.sortable) {
      return false;
    }

    const columnSortField = column.sortField || column.field;

    if (this.sortMode === 'single') {
      return this.sortField && columnSortField === this.sortField;
    } else if (this.sortMode === 'multiple') {
      let sorted = false;
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field === columnSortField) {
            sorted = true;
            break;
          }
        }
      }
      return sorted;
    }
  }

  /**
   * Returns the current sorting order of a given column
   */
  getSortOrder(column: IsGridColumn) {
    let order = 0;
    const columnSortField = column.sortField || column.field;

    if (this.sortMode === 'single') {
      if (this.sortField && columnSortField === this.sortField) {
        order = this.sortOrder;
      }
    } else if (this.sortMode === 'multiple') {
      if (this.multiSortMeta) {
        for (let i = 0; i < this.multiSortMeta.length; i++) {
          if (this.multiSortMeta[i].field === columnSortField) {
            order = this.multiSortMeta[i].order;
            break;
          }
        }
      }
    }
    return order;
  }

  /**
   * Resets the sort field and order
   */
  reset() {
    this.sortField = null;
    this.sortOrder = 1;
  }
}
