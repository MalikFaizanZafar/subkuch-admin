import { IsGridColumn } from '../shared/column';
import { ObjectUtils } from '../utils/object-utils';
import { IsGridFilterMetadata, IsGridFilterMatchMode } from '../utils/models/index';

const IS_GRID_DEFAULT_FILTER_DELAY = 300;

export class IsGridFilterHandler {

  /**
   * The input element for the global filter
   */
  globalFilter: HTMLInputElement;

  /**
   * Search text typed inside the paginator
   */
  paginatorFilterValue: string;

  /**
   * Array of filtered values
   */
  filteredValue: any[];

  /**
   * Default delay for the filter
   */
  filterDelay = IS_GRID_DEFAULT_FILTER_DELAY;

  /**
   * Filter Timeout
   */
  filterTimeout: any;

  /**
   * Main filters objet
   */
  filters: { [s: string]: IsGridFilterMetadata } = {};

  /**
   * Object that contains the main functions used to filter the data
   */
  filterConstraints = {
    startsWith(value, filter, matchCase: boolean): boolean {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toLowerCase();
      return (
        value
          .toString()
          .toLowerCase()
          .slice(0, filterValue.length) === filterValue
      );
    },

    contains(value, filter, matchCase: boolean): boolean {
      if (
        filter === undefined ||
        filter === null ||
        (typeof filter === 'string' && filter.trim() === '')
      ) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }
      if (matchCase) {
        return (
          value
            .toString()
            .indexOf(filter.toString()) !== -1
        );
      } else {
        return (
          value
            .toString()
            .toLowerCase()
            .indexOf(filter.toString().toLowerCase()) !== -1
        );
      }
    },

    endsWith(value, filter, matchCase: boolean): boolean {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      const filterValue = filter.toString().toLowerCase();
      return (
        value
          .toString()
          .toLowerCase()
          .indexOf(
            filterValue,
            value.toString().length - filterValue.length
          ) !== -1
      );
    },

    equals(value, filter, matchCase: boolean): boolean {
      if (
        filter === undefined ||
        filter === null ||
        (typeof filter === 'string' && filter.trim() === '')
      ) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toString().toLowerCase() === filter.toString().toLowerCase();
    },

    notEquals(value, filter, matchCase: boolean): boolean {
      if (
        filter === undefined ||
        filter === null ||
        (typeof filter === 'string' && filter.trim() === '')
      ) {
        return false;
      }

      if (value === undefined || value === null) {
        return true;
      }

      return value.toString().toLowerCase() !== filter.toString().toLowerCase();
    },

    in(value, filter: any[], matchCase: boolean): boolean {
      if (filter === undefined || filter === null || filter.length === 0) {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      for (let i = 0; i < filter.length; i++) {
        if (filter[i] === value) { return true; }
      }

      return false;
    }
  };

  constructor(public objectUtils: ObjectUtils) {}

  /**
   * Whether or not the filter is blank
   */
  isFilterBlank(filter: any): boolean {
    if (filter !== null && filter !== undefined) {
      if ((typeof filter === 'string' && filter.trim().length === 0) ||
        (filter instanceof Array && filter.length === 0)) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Filter data according to the configuration passed
   */
  filter(value: any, field: string, matchMode: IsGridFilterMatchMode, inputValue: any) {
    if (!this.isFilterBlank(value)) {
      this.filters[field] = { value, matchMode, inputValue };
    } else if (this.filters[field]) {
       delete this.filters[field];
    }
  }

  /**
   * Main filtering function based on local and global matches
   */
  _filter(value, columns: IsGridColumn[], matchCase) {
      this.filteredValue = [];

      for (let i = 0; i < value.length; i++) {
        let localMatch = true;
        let globalMatch = false;

        for (let j = 0; j < columns.length; j++) {
          const col = columns[j],
            filterMeta = this.filters[col.filterField || col.field];

          // local
          if (filterMeta) {
            const filterValue = filterMeta.value,
              filterField = col.filterField || col.field,
              filterMatchMode = filterMeta.matchMode || 'in',
              dataFieldValue = this.objectUtils.resolveFieldData(
                value[i],
                filterField
              );
            const filterConstraint: IsGridFilterFn = this.filterConstraints[filterMatchMode];

            if (!filterConstraint(dataFieldValue, filterValue, false)) {
              localMatch = false;
            }

            if (!localMatch) {
              break;
            }
          }

          // global
          if (!col.excludeGlobalFilter && !globalMatch ) {
           if ( this.globalFilter ) {
            globalMatch = this.filterConstraints['contains'](
              this.objectUtils.resolveFieldData(
                value[i],
                col.filterField || col.field
              ),
              this.globalFilter.value,
              false
            );
          } else if (this.paginatorFilterValue) { // paginator
            globalMatch  = this.filterConstraints['contains'](
              this.objectUtils.resolveFieldData(
                value[i],
                col.filterField || col.field
              ),
              this.paginatorFilterValue,
              matchCase
            );
            }
          }
        }

        let matches = localMatch;
        if (this.globalFilter || this.paginatorFilterValue) {
          matches = localMatch && globalMatch;
        }

        if (matches) {
          this.filteredValue.push(value[i]);
        }
      }

      if (this.filteredValue.length === value.length) {
        this.filteredValue = null;
      }

  }

  /**
   * Whether the grid has active filters.
   */
  hasFilter() {
    let empty = true;
    for (const prop in this.filters) {
      if (this.filters.hasOwnProperty(prop)) {
        empty = false;
        break;
      }
    }

    return (
      !empty ||
      (this.globalFilter &&
       this.globalFilter.value &&
       this.globalFilter.value.trim().length)
    );
  }

  /**
   * Resets the filtered value
   */
  reset() {
    this.filteredValue = null;
  }
}

export type IsGridFilterFn = (value: any, filter: any, matchCase: boolean) => boolean;
