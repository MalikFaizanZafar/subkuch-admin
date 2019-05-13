import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
  HostBinding,
  HostListener
} from '@angular/core';

import { IsTableService } from './table.service';
import { IsTableOrderingType } from './table';
import { isObject, isNumber } from '../core/shared/utils/utils';

/**
 * Class that creates table
 */
@Component({
  selector: 'table[is-table]',
  templateUrl: 'table.html',
  styleUrls: ['table.scss'],
  host: {
    '[class.is-table]': 'true'
  },
  encapsulation: ViewEncapsulation.None
})
export class IsTable implements AfterViewInit, OnInit, AfterContentInit, OnChanges {
  /**
   * Data for table
   */
  @Input()
  data: any[];

  /**
   * Default order of data in table
   */
  @Input()
  defaultOrder: any | string;

  /**
   * Checks if table is responsive or not
   * @default {true}
   */
  @Input()
  @HostBinding('class.is-table--responsive')
  responsive = true;

  /**
   * Saves copy of original data
   */
  private dataCopy: any[];

  /**
   * Saves current order of table data
   * @default {{}}
   */
  private currentOrder: any = {};

  /**
   * Models a filter object over all the table
   * @default {{}}
   */
  filter: any = {};

  /**
   * Table id to be used by table service
   */
  tableId: number;

  /**
   * Constructor method injects table service and element reference
   * privately in class
   * @param isTable
   * @param el
   */
  constructor(private isTable: IsTableService, public el: ElementRef) {}

  /**
   * Lifecycle method called after view is initialised
   * Creates data copy from original data
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataCopy = [];
      if (this.data) {
        this.dataCopy = this.data.slice();
      }
    }, 1);
  }

  /**
   * Lifecycle method called on component initialisation
   * Register tables in table service
   * Sets class, sets table id attribute to table
   * Sets table id to all header columns
   * Build the filter object and register it in the service
   * Subscribes to sortedPropertyChanged observable,
   *    that orders the table with given order and saves current order
   * Subscribes to filterChanged observable,
   *    that filters the table with given payload
   */
  ngOnInit() {
    this.tableId = this.isTable.registerTable();
    this.el.nativeElement.classList.add(`is-table__id-${this.tableId}`);
    this.el.nativeElement.setAttribute('is-table-id', `${this.tableId}`);
    const elems = document.querySelectorAll(`.is-table__id-${this.tableId} th`);
    this.setIdToComponents(elems);

    // Build the filter object and register it in the service
    this.initFilter();
    this.isTable.saveFilter(this.filter, this.tableId);

    this.isTable.$sortedPropertyChanged.subscribe(order => {
      if (order.tableId === this.tableId) {
        if (order.alterTable) {
          this.orderBy(order.prop, order.orderType);
        }
        this.currentOrder = {
          prop: order.prop,
          orderType: order.orderType
        };
      }
    });

    this.isTable.$filterChanged.subscribe(payload => {
      if (payload.tableId === this.tableId) {
        this.filterTable(payload.filter);
      }
    });
  }

  /**
   * Lifecycle method called after content initialisation
   * Sets table id to all rows
   * Sorts the table with default order
   */
  ngAfterContentInit() {
    const elems = document.querySelectorAll(`.is-table__id-${this.tableId} tr`);
    this.setIdToComponents(elems);

    // As there's no clear component tree, this timeout will ensure that the
    // sortable-column components are initialized before attempting the default
    // sort
    setTimeout(() => {
      // If the defaultOrder input is set, then order the table according to
      // the input type
      if (this.defaultOrder) {
        // if just the property name is passed, order in descending order
        if (typeof this.defaultOrder === 'string') {
          this.isTable.orderTable(this.defaultOrder, 'desc', true, this.tableId);
        } else if (typeof this.defaultOrder === 'object') {
          // default order to descending if not specified or a
          // wrong property is passed
          if (!this.defaultOrder.order ||
            (this.defaultOrder.order !== 'asc' &&
            this.defaultOrder.order !== 'desc')) {
            this.defaultOrder.order = 'desc';
          }

          // Alter table by default
          this.defaultOrder.alterTable = this.defaultOrder.alterTable === undefined || this.defaultOrder.alterTable;
          this.isTable.orderTable(
            this.defaultOrder.property,
            this.defaultOrder.order,
            this.defaultOrder.alterTable,
            this.tableId);
        }
      }
      if (this.responsive) {
        this.prepareForResponsiveness();
      }
    }, 1);
  }

  /**
   * Lifecycle method called on data change
   * Initializes filters and registers them to table service
   * Re creates data copy from original data
   * If table is responsive, prepare it for responsiveness
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    /**
     * Register new filters according to new data
     * If the previous value is not an array,
     * it means this is the first time ngOnChanges gets called
     * and so there's no point in registering a different filter
     * Use rAF to wait for the DOM to render the new data before
     * manipulating the attributes
     */
    requestAnimationFrame(() => {
      if (!changes['data'].firstChange) {
        this.initFilter();
        this.isTable.saveFilter(this.filter, this.tableId);
        // Update the data deepcopy
        this.dataCopy = this.data.slice();

        // Add table id to new trs
        const elems = document.querySelectorAll(`.is-table__id-${this.tableId} tr`);
        this.setIdToComponents(elems);

        if (this.responsive) {
          this.prepareForResponsiveness();
        }
      }
    });
  }

  /**
   * This method will add data-header and aria-label tags to all td's.
   * The data-header attribute will be used in css by the pseudo element via `content: attr(data-header)`
   * @param [_headers] - list of nodes representing the th from which the texts will be taken from
   * @memberof IsTable
   */
  prepareForResponsiveness(_headers?: NodeList) {
    const headers = _headers || this.el.nativeElement.querySelectorAll('thead th');
    const headersTexts = Array.from(headers).map((h: HTMLElement) => h.textContent.trim());

    const rows = this.el.nativeElement.querySelectorAll(`tbody > tr`);
    // Now we loop through all the tds and set the data-header which will
    // be the content of the pseudo element
    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].querySelectorAll('td');
      for (let j = 0; j < cols.length; j++) {
        //  only assign the data-header attribute if it's not currently present
        if (!cols[j].getAttribute('data-header')) {
          cols[j].setAttribute('data-header', headersTexts[j]);
        }
        // assign the aria-label to help assistive technologies
        // know what's the header of the row
        if (!cols[j].getAttribute('aria-label')) {
          cols[j].setAttribute('aria-label', headersTexts[j]);
        }
      }
    }
  }

  /**
   * Sets 'table-id' attribute to given elements
   * @param elems
   */
  private setIdToComponents(elems) {
    // Sets a property to its children to identify them
    for (let i = 0; i < elems.length; i++) {
      elems[i].setAttribute('table-id', `${this.tableId}`);
    }
  }

  /**
   * Creates filter object for all columsn with 'filterable' attribute
   * with column name as specified in 'sortBy' attribute
   */
  private initFilter() {
    this.filter = {};
    // Find all filterable columns and init the filter
    const columns = document.querySelectorAll(`.is-table__id-${this.tableId} [filterable]`);

    // The sortBy property is the same one used to filter
    Array.from(columns).map((column: HTMLElement) => this.addPropertyToFilter(column.getAttribute('sortBy')));
  }

  /**
   * Orders table data by given prop and order type
   * @param prop
   * @param orderType
   */
  orderBy(prop: string, orderType: IsTableOrderingType) {
    if (prop && orderType) {
      const orderFactor = orderType === 'asc' ? 1 : -1;
      this.data.sort((a, b) => {
        // Sort logic for numbers and dates -- sort logic for string in the
        // else part
        if ((isNumber(a[prop]) && isNumber(b[prop])) ||
          (isObject(a[prop]) && isObject(b[prop]))) {
          if (a[prop] < b[prop]) {
            return -orderFactor;
          } else {
            return orderFactor;
          }
        } else {
          if (a[prop].toLowerCase()
            .localeCompare(b[prop].toLowerCase()) < 0) {
            return -orderFactor;
          } else {
            return orderFactor;
          }
        }
      });
    }
  }

  /**
   * Filters table with given filter object
   * @param filter
   */
  filterTable(filter: any) {
    this.data.splice(0, this.data.length);
    this.dataCopy
      .filter(row => Object.keys(filter)
        .reduce((allowed, property) => {
          const columnValue = row[property];
          if (!filter[property][columnValue]) {
            allowed = false;
          }
          return allowed;
        }, true))
      .forEach(row => this.data.push(row));
    this.orderBy(this.currentOrder.prop, this.currentOrder.orderType);
  }

  /**
   * Adds column name as property to filter object
   * and sets true to all data for the given column
   * by default
   * @param property
   */
  private addPropertyToFilter(property: string) {
    this.filter[property] = this.filter[property] || {};
    this.filter[property] = this.data
      .map(row => row[property])
      .reduce((filter, prop) => {
        const keys = Object.keys(filter);
        if (keys.indexOf(prop) === -1) {
          filter[prop] = true;
        }
        return filter;
      }, this.filter[property]);
  }

  /**
   * Listen to global clicks in the document to hide the filter popover
   * Check if the click was triggered outside the filter popover
   * @param event
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    const popovers = this.isTable.getPopovers(this.tableId);
    if (popovers && popovers.length > 0) {
      if (!this.getClosest(event.target, '.is-filters')
        && !(event.target.classList
            && event.target.classList.contains('is-filter-button'))) {
          popovers.map(popover => popover.isOpen() && popover.close());
      }
    }
  }

  /**
   * Finds closest element with given
   * selector from given element
   * @param element
   * @param selector
   */
  private getClosest(element, selector) {
    for (; element && element !== document; element = element.parentNode) {
      if (element.matches(selector)) {
        return element;
      }
    }
    return null;
  }
}

/**
 * Type IsTableOrderingType
 * Holds possible values for table order
 * 'asc' => Ascending order
 * 'desc' => Descending order
 */
export type IsTableOrderingType = 'asc' | 'desc';
