import { BreakpointObserver } from '@angular/cdk/layout';
import { ElementRef, Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { IsTableOrderingType } from './table';
import { IsTableConfiguration } from './table-configuration';
import { IS_TABLE_CONFIGURATION } from './table-configuration.token';
import { DEFAULT_CONFIG } from './table-configuration.constant';

/**
 * IsTableService service
 * For sorting and filtering all tables
 * using this service.
 */
@Injectable()
export class IsTableService {
  /**
   * Source to keep track of sort property change
   */
  private sortedPropertyChangedSource = new Subject<any>();

  /**
   * Subscribe to this observable to listen for changes in sorted columns
   */
  $sortedPropertyChanged: Observable<any> = this.sortedPropertyChangedSource.asObservable();

  /**
   * Source to keep track of change in filter
   */
  private filterChangedSource = new Subject<any>();

  /**
   * Subject that emits when browser is resized
   *
   * @memberof IsTableService
   */
  private resizeSource = new Subject<any>();

  /**
   * Subscribe to this observable to listen for changes in filters
   */
  $filterChanged: Observable<any> = this.filterChangedSource.asObservable();

  /**
   * Subscribe to this observable to listen for changes in filters
   */
  $columnResize: Observable<any> = this.resizeSource.asObservable();

  /**
   * Observable that emits when features should be disabled
   *
   * @memberof IsTableService
   */
  $shouldDisableFeatures: Observable<boolean>;

  /**
   * Number of tables
   * @default {0}
   */
  numTables = 0;

  /**
   * Models all filters object over all the tables
   * @default {[]}
   */
  filters: any[] = [];

  /**
   * Keep track of opened/expanded rows
   * @default {[]}
   */
  openedRows: any[] = [];

  /**
   * Keep track of popovers of a table
   */
  popovers: any[] = [];

  /**
   * Creates an instance of IsTableService.
   * @param configuration
   * @param breakpointObserver
   * @memberof IsTableService
   */
  constructor( @Optional() @Inject(IS_TABLE_CONFIGURATION)
               private configuration: IsTableConfiguration,
               private breakpointObserver: BreakpointObserver ) {
    const config = this.configuration ? this.configuration.mediaQueryToOmitFeatures :
      DEFAULT_CONFIG.mediaQueryToOmitFeatures;
    this.$shouldDisableFeatures = this.breakpointObserver
      .observe(config)
      .pipe(map(result => result.matches));
  }

  /**
   * Event emitter for resize
   * @param elementRef
   */
  onResize( elementRef: ElementRef ) {
    this.resizeSource.next(elementRef);
  }

  /**
   * Broadcasts sort property changes so that all components
   * subscribing to the sort property change observable
   * can make use of it.
   * In some cases, the table shouldn't be altered but
   * all the ordering events should be triggered anyways.
   * Parameter 'alterTable' indicated whether the table
   * should be altered/mutated or not.
   * @param prop
   * @param orderType
   * @param alterTable
   * @param tableId
   */
  orderTable( prop: string, orderType: IsTableOrderingType, alterTable: boolean, tableId: number ) {
    this.sortedPropertyChangedSource.next({
      prop,
      orderType,
      alterTable,
      tableId
    });
  }

  /**
   * Broadcasts filter property changes so that all components
   * subscribing to the filter property change observable
   * can make use of it.
   * @param tableId
   */
  filterTable( tableId ) {
    this.filterChangedSource.next({
      filter: this.filters[tableId],
      tableId
    });
  }

  /**
   * Checks if property filter is changed in
   * filter object for given table
   * @param property
   * @param tableId
   */
  isPropertyFiltered( property: string, tableId: number ) {
    const filterProps = this.filters[tableId][property];
    if (filterProps) {
      return Object.keys(filterProps)
        .reduce(( isFiltered, prop ) => {
          return isFiltered || (typeof filterProps[prop] === 'boolean' && !filterProps[prop]);
        }, false);
    }
    return false;
  }

  /**
   * Registers table by increasing
   * number of table counter
   */
  registerTable() {
    this.numTables++;
    return this.numTables;
  }

  /**
   * Saves filter object for given table
   * @param filter
   * @param tableId
   */
  saveFilter( filter, tableId ) {
    this.filters[tableId] = filter;
  }

  /**
   * Gets filter object for given table
   * @param tableId
   */
  getFilter( tableId ) {
    return this.filters[tableId];
  }

  /**
   * Sets opened row for row's table id
   * @param row
   */
  setOpenedRow( row ) {
    this.openedRows[row.tableId] = row;
  }

  /**
   * gets opened row for given table id
   * @param tableId
   */
  getOpenedRow( tableId ) {
    return this.openedRows[tableId];
  }

  /**
   * Sets opened popover for popover's table id
   * @param popover
   * @param tableId
   */
  setPopover( popover, tableId ) {
    this.popovers[tableId] = this.popovers[tableId] || [];
    this.popovers[tableId].push(popover);
  }

  /**
   * gets opened row for given table id
   * @param tableId
   */
  getPopovers( tableId ) {
    return this.popovers[tableId];
  }
}
