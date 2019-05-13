import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  Renderer2,
  Self,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil, filter } from 'rxjs/operators';
import { IsResizeService } from '../../core/index';
import { IsReorderableTable } from '../reorderable-table/reorderable-table';
import { IsTableRow } from '../table-row';
import { IsTableService } from '../table.service';
import { IsLockableColumn } from './lockable-column';
import { IsLockableData } from './lockable-data';
import { IsLockableElement } from './lockable-element';

/**
 * Class to make columns lockable
 *
 * @export
 */
@Directive({
  selector: 'table[is-lockable-table]'
})
export class IsLockableTable implements AfterContentInit, OnChanges, OnDestroy {
  /**
   * Window width
   */
  windowWidth = window.screen.width;

  /**
   * This table id.
   */
  tableId: number;

  /**
   * The ReorderableTable directive, if available.
   *
   * @memberof IsLockableTable
   */
  reorderableTable: IsReorderableTable | null;

  /**
   * Offset For locked columns when scrolling happens
   */
  offsetLeft = 0;

  /**
   * List of table column heads
   *
   * @memberof IsLockableTable
   */
  @ContentChildren(IsLockableColumn, {descendants: true})
  lockableHeaderColumns: QueryList<IsLockableColumn>;

  /**
   * List of lockable rows
   *
   * @memberof IsLockableTable
   */
  @ContentChildren(IsLockableData, {descendants: true})
  lockableDataColumns: QueryList<IsLockableData>;

  /**
   * List of table rows
   *
   * @memberof IsLockableTable
   */
  @ContentChildren(IsTableRow, {descendants: true})
  tableRows: QueryList<IsTableRow>;

  /**
   * Table columns as an Array of IsLockableColumn
   *
   * @memberof IsLockableTable
   */
  lockableHeaderColumnsArray: IsLockableColumn[] = [];

  /**
   * Indicates if the directive is setup
   *
   * @memberof IsLockableTable
   */
  isSetup = false;

  /**
   * Subject that emits a value when destroyed
   *
   * @protected
   * @memberof IsLockableTable
   */
  protected readonly destroy$ = new Subject();

  /**
   * Injects element reference, renderer,
   * ng zone, table service and reorderable
   * table directive in component
   *
   * @param el
   * @param renderer
   * @param ngZone
   * @param tableService
   * @param resizeService
   * @param reorderableTable
   */
  constructor(private el: ElementRef,
              private renderer: Renderer2,
              public ngZone: NgZone,
              private tableService: IsTableService,
              private resizeService: IsResizeService,
              @Self() @Optional() reorderableTable: IsReorderableTable) {
   this.reorderableTable = reorderableTable;
   this.resizeService.onWindowResize.subscribe(() => {
     this.windowWidth = window.screen.width;
     requestAnimationFrame(() => this.reorderColumns());
   });
  }

  /**
   * Waits until content is rendered to setup directive
   *
   * @memberof IsLockableTable
   */
  ngAfterContentInit() {
    setTimeout(() => {
      const isTableIdNode = this.el.nativeElement.getAttributeNode('is-table-id');
      this.tableId = isTableIdNode ? Number(isTableIdNode.value) : null;
    }, 500);

    this.tableService.$shouldDisableFeatures
      .pipe(takeUntil(this.destroy$))
      .subscribe(shouldDisable => {
        if (shouldDisable && this.isSetup) {
          this.teardown();
        }
        if (!shouldDisable && !this.isSetup) {
          this.setup();
        }
      });
  }

  /**
   * Setups the lockable table feature
   * Initialize listeners
   * Subscribe to parent wrapper's scroll
   * to update offsetLeft and adjust positioning
   *
   * @protected
   * @memberof IsLockableTable
   */
  protected setup() {
    this.isSetup = true;
    this.offsetLeft = 0;
    this.initListeners();
    // Listens for scroll event on parent wrapper, which holds the overflow
    // rule.
    this.renderer.listen(this.el.nativeElement.parentElement, 'scroll', evt => {
      // Scroll events are triggered on a high rate, therefore to avoid race
      // conditions and any sort of performance downside, we mitigate that
      // using runOutsideAngular from ngZone
      if (!this.isSetup) {
        return;
      }
      this.ngZone.runOutsideAngular(() =>
        requestAnimationFrame(() => {
          // Defines new OffsetLeft based on scrolling so the locked columns
          // are always positioned correctly
          this.offsetLeft = evt.target.scrollLeft;
          // then, adjust the positioning only, no need for a whole
          // reorderColumns call
          this.adjustPositioning();
        })
      );
    });

  }

  /**
   * Disables the lockable table feature
   *
   * @protected
   * @memberof IsLockableTable
   */
  protected teardown() {
    this.isSetup = false;
    const tableRows = this.tableRows.toArray();
    // get all <tr> with type header
    const headerRows = tableRows.filter(elem => elem.type === 'header');
    // get all <tr> with type data
    const dataRows = tableRows.filter(elem => elem.type === 'data');
    // remove padding
    this.removePadding(headerRows, dataRows);
  }

  /**
   * Triggers a reorder when  changed
   *
   * @memberof IsLockableTable
   */
  ngOnChanges() {
    requestAnimationFrame(() => this.reorderColumns());
  }

  /**
   * Listen on columns on Lock
   *
   * @memberof IsLockableTable
   */
  initListeners() {
    this.lockableHeaderColumnsArray = this.lockableHeaderColumns.toArray();

    // register listeners
    this.tableService.$columnResize
      .pipe(
        filter(this.byTableId),
        takeUntil(this.destroy$)
      )
      .subscribe(this.onColumnResize);
    this.lockableHeaderColumns.changes.subscribe(this.onColumnChange.bind(this));
    this.lockableDataColumns.changes.subscribe(this.onDataChange.bind(this));

    // account for cases where there's locked elements by default
    const lockedColumns = this.lockableHeaderColumnsArray.filter(entry => entry.locked);

    for (let i = 0; i < lockedColumns.length; i++) {
      const col: IsLockableColumn = lockedColumns[i];
      col.handleLock(true);
      const lockedData = this.lockableDataColumns.filter(entry => entry.orderId === col.orderId);
      for (let j = 0; j < lockedData.length; j++) {
        const row = lockedData[j];
        row.adjustStyles(true);
      }
    }

    // Register listeners for those default locked elements if required
    this.onColumnChange();
  }

  /**
   * On column resize Listener.
   *
   * @param elementRef
   * @memberof IsLockableTable
   */
  onColumnResize = ( elementRef: ElementRef ) => {
    const orderId = elementRef.nativeElement.getAttributeNode('order-id');
    const width = elementRef.nativeElement.offsetWidth;

    if (orderId) {
      const orderIdValue = Number(orderId.value);
      const th = this.lockableHeaderColumns.find(entry => entry.orderId === orderIdValue);
      th.width = width;

      this.reorderColumns();
    }
  }

  /**
   * Adjust locked columns, get them in position and consolidate its boundaries
   *
   * @memberof IsLockableTable
   */
  reorderColumns() {
    // get all <tr> with is-table-column
    const tableRows = this.tableRows.toArray();
    // get all <tr> with type header
    const headerRows = tableRows.filter(elem => elem.type === 'header');
    // get all <tr> with type data
    const dataRows = tableRows.filter(elem => elem.type === 'data');
    // remove padding
    this.removePadding(headerRows, dataRows);
    // Get all locked columns
    const lockedColumns = this.lockableHeaderColumnsArray.filter(entry => entry.locked);
    // if there's a reordable table with the lockable table
    if (this.reorderableTable) {
      lockedColumns.sort(this.compareColOrder);
    }

    // if there's locked columns at all
    if (lockedColumns.length > 0) {
      // create padding
      this.createPadding(lockedColumns, headerRows, dataRows);
      // To avoid race conditions, request animation frame to schedule locked
      // elements positioning
      requestAnimationFrame(() => this.isSmallScreen()
        ? this.adjustLockedColumnsVertically(lockedColumns, headerRows, dataRows)
        : this.adjustLockedColumnsHorizontally(lockedColumns, headerRows, dataRows));
    }
  }

  /**
   * Get locked columns into position for horizontal table
   *
   * @param lockedColumns
   * @param headerRows
   * @param dataRows
   * @memberof IsLockableTable
   */
  adjustLockedColumnsHorizontally( lockedColumns, headerRows, dataRows ) {
    let left = this.offsetLeft;

    for (let i = 0; i < lockedColumns.length; i++) {
      const column = lockedColumns[i];
      let top = 0;

      /**
       * Adjust <th> inside header <tr> based on top, left and height
       * Get the height of header row
       */
      const headerHeight = headerRows[0].el.nativeElement.offsetHeight;
      column.adjustBondaries(top, left, column.width, headerHeight);

      /**
       * sum the top value with the <th> height
       * If table is an infinite table then
       * header rows and data rows are in separate tables
       * so we don't need to consider header row height for
       * positionsing data row columns as data row columns are relative
       * table wrapper
       */
      const headerElementTableId = Number(headerRows[0].el.nativeElement.getAttribute('table-id'));
      let dataElementTableId = -1;
      if (dataRows[0]) {
        dataElementTableId = Number(dataRows[0].el.nativeElement.getAttribute('table-id'));
      }
      if (headerElementTableId === dataElementTableId) {
        top += column.height;
      }

      /**
       * adjust positioning and size for <td> inside each <tr>
       * get all <td> rows that share the same id as the above <th>
       */
      const dataColumns = this.lockableDataColumns.filter(entry => entry.orderId === column.orderId);
      for (let j = 0; j < dataColumns.length; j++) {
        // get the height of particular <tr> that <td> belongs to
        const dataHeight = dataRows[j].el.nativeElement.offsetHeight;
        dataColumns[j].adjustBondaries(top, left, column.width, dataHeight);

        // sum the height just calculated so the next <td> will be right below
        // this one
        top += dataColumns[j].height;
      }

      // sum column width so we get a left padding for N number of columns
      left += column.width;
    }
  }

  /**
   * Get locked columns into position for vertical table
   *
   * @param lockedColumns
   * @param headerRows
   * @param dataRows
   * @memberof IsLockableTable
   */
  adjustLockedColumnsVertically( lockedColumns, headerRows, dataRows ) {
    let top = 0;

    for (let i = 0; i < lockedColumns.length; i++) {
      const column = lockedColumns[i];

      // region Adjust <th> inside header <tr> based on top, left and height
      // Get the height of header row
      const headerHeight = this.getMaxColumnHeight(headerRows[0]);
      column.adjustBondaries(top, 0, column.width, headerHeight);
      // endregion

      // region adjust positioning and size for <td> inside each <tr>
      // get all <td> rows that share the same id as the above <th>
      const dataColumns = this.lockableDataColumns.filter(entry => entry.orderId === column.orderId);
      for (let j = 0; j < dataColumns.length; j++) {
        // get the height of particular <tr> that <td> belongs to
        const dataHeight = this.getMaxColumnHeight(dataRows[j]);
        dataColumns[j].adjustBondaries(top, 0, column.width, dataHeight);

        // sum the height just calculated so the next <td> will be right below
        // this one
      }
      // endregion

      // sum column width so we get a left padding for N number of columns
      top += column.height;
    }
  }

  /**
   * Checks if window is resizes to small screen of width
   * equals to or less than 767px
   *
   * @memberof IsLockableTable
   */
  isSmallScreen() {
    return this.windowWidth <= 767;
  }

  /**
   * Gets max height of row traversing all columns
   * Height of row differs if table is vertical in
   * case of small screens
   *
   * @param row
   * @memberof IsLockableTable
   */
  getMaxColumnHeight(row: IsTableRow): number {
    let columns = row.el.nativeElement.querySelectorAll('th');
    columns = columns.length > 0
      ? columns
      :  row.el.nativeElement.querySelectorAll('td');

    let maxHeight = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].getAttribute('id') !== 'paddingTh' &&
      columns[i].getAttribute('id') !== 'paddingTd') {
        maxHeight = maxHeight < columns[i].offsetHeight
          ? columns[i].offsetHeight
          : maxHeight;
      }
    }

    return maxHeight;
  }

  /**
   * Removes padding elements on the table
   * @param headerRows
   * @param dataRows
   */
  removePadding( headerRows, dataRows ) {
    // remove all padding elements from <tr> header
    let i;

    for (i = 0; i < headerRows.length; i++) {
      const headerColumn = headerRows[i];

      const firstChild = headerColumn.el.nativeElement.firstElementChild;

      if (firstChild.getAttribute('id') === 'paddingTh') {
        headerColumn.el.nativeElement.removeChild(firstChild);
      }
    }
    // remove all padding elements from <tr> data
    for (i = 0; i < dataRows.length; i++) {
      const dataRow = dataRows[i];
      const firstChild = dataRow.el.nativeElement.firstElementChild;

      if (firstChild.getAttribute('id') === 'paddingTd') {
        dataRow.el.nativeElement.removeChild(firstChild);
      }
    }
  }

  /**
   * Creates and inserts padding elements on the table
   * @param lockedColumns
   * @param headerRows
   * @param dataRows
   */
  createPadding( lockedColumns, headerRows, dataRows ) {
    let i;

    const lockedColumnsWidth = lockedColumns.reduce(( current, next: IsLockableElement ) => {
      return current + next.width;
    }, 0);
    const lockedColumnsHeight = lockedColumns.reduce(( current, next: IsLockableElement ) => {
      let datacols: QueryList<IsLockableData | IsLockableColumn> = this.lockableDataColumns;
      if (datacols.length === 0) {
        datacols = this.lockableHeaderColumns;
      }
      const dataColumn = datacols.filter(entry => entry.orderId === next.orderId)[0];
      return current + dataColumn.height;
    }, 0);

    // insert a <th> serving as padding to be underneath the locked <th>
    for (i = 0; i < headerRows.length; i++) {
      const headerColumn = headerRows[i];
      headerColumn.el.nativeElement.insertAdjacentHTML(
        'afterbegin',
        `<th id="paddingTh" style="min-width: ${lockedColumnsWidth}px;
                                   max-width:${lockedColumnsWidth}px;
                                   width:${lockedColumnsWidth}px;" ></th>`);
    }
    // insert a <td> serving as padding to be underneath the locked <td>'s
    for (i = 0; i < dataRows.length; i++) {
      const dataColumn = dataRows[i];
      if (this.isSmallScreen()) {
        dataColumn.el.nativeElement.insertAdjacentHTML(
          'afterbegin',
          `<td id="paddingTd" style="max-height:${lockedColumnsHeight}px;
                                    min-height:${lockedColumnsHeight}px;
                                    height:${lockedColumnsHeight}px;"></td>`);

      } else {
        dataColumn.el.nativeElement.insertAdjacentHTML(
          'afterbegin',
          `<td id="paddingTd" style="max-width:${lockedColumnsWidth}px;
                                    min-width:${lockedColumnsWidth}px;
                                    width:${lockedColumnsWidth}px;"></td>`);
      }
    }
  }

  /**
   * Sort function to determine the reordable order
   * to be applied when locking columns
   * Only used when reorderable table is used with lockable table
   *
   * @param a
   * @param b
   * @memberof IsLockableTable
   */
  compareColOrder = ( a: IsLockableColumn, b: IsLockableColumn ) => {
    const reordableColOrder = this.reorderableTable.colOrder;
    const indexA = this.getColOrderIndexBasedOnReordableColumns(
      reordableColOrder,
      a.orderId
    );
    const indexB = this.getColOrderIndexBasedOnReordableColumns(
      reordableColOrder,
      b.orderId
    );

    if (indexA < indexB) {
      return -1;
    } else if (indexA > indexB) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Function that returns the index of a column
   * when there's a reordable table alongside lockable table
   *
   * @param orderIdList
   * @param orderId
   * @memberof IsLockableTable
   */
  getColOrderIndexBasedOnReordableColumns( orderIdList: Array<number>, orderId: number ): number {
    return orderIdList.reduce((colIndex, col, i) => {
      colIndex = col === orderId ? i : colIndex;
      return colIndex;
    }, -1);
  }

  /**
   * Adjusts locked columns left positioning on scroll
   *
   * @memberof IsLockableTable
   */
  adjustPositioning() {
    const lockedColumns = this.lockableHeaderColumnsArray.filter(entry => entry.locked);
    let left = this.offsetLeft;

    for (let i = 0; i < lockedColumns.length; i++) {
      const column = lockedColumns[i];
      column.adjustLeft(left);

      const rows = this.lockableDataColumns.filter(entry => entry.orderId === column.orderId);
      for (let j = 0; j < rows.length; j++) {
        const row = rows[j];
        row.adjustLeft(left);
      }
      left += column.width;
    }
  }

  /**
   * On column Resize Listener.
   * @param elementRef
   */
  onColumnReorder = ( elementRef: ElementRef ) => {
    if (!this.isSetup) {
      return;
    }
    const orderId = elementRef.nativeElement.getAttributeNode('order-id');
    const width = elementRef.nativeElement.offsetWidth;
    if (orderId) {
      const orderIdValue = Number(orderId.value);
      const th = this.lockableHeaderColumns.find(
        entry => entry.orderId === orderIdValue
      );
      th.width = width;

      this.reorderColumns();
    }
  }

  /**
   * On Dynamic Column Changes
   * Register proper listeners, and reorder columns
   */
  onColumnChange() {
    if (!this.isSetup) {
      return;
    }
    for (let i = 0; i < this.lockableHeaderColumnsArray.length; i++) {
      const col = this.lockableHeaderColumnsArray[i];
      // listens for onLock event trigger on IsLockableColumn element
      col.onLock.subscribe(locked => {
        // get all <td> in the same column as this particular column.
        const dataCols = this.lockableDataColumns.filter(entry => entry.orderId === i);
        // Toggle  the lock for the <td>'s list
        for (let j = 0; j < dataCols.length; j++) {
          const dataCol = dataCols[j];
          dataCol.adjustStyles(locked);
        }
        // re-order columns positioning
        this.reorderColumns();
      });
    }
  }

  /**
   * Returns true if the elementRef table Id equals this table id.
   * @param elementRef
   */
  byTableId = (elementRef: ElementRef) => {
    return Number(elementRef.nativeElement.parentElement.getAttributeNode('table-id').value) === this.tableId;
  }

  /**
   * On Dynamic Data Changes
   * Register proper listeners, and reorder columns
   */
  onDataChange () {
    if (!this.isSetup) {
      return;
    }

    // Get all locked header columns
    const lockedColumns = this.lockableHeaderColumnsArray.filter(entry => entry.locked);

    for (let i = 0; i < lockedColumns.length; i++) {
      const column = lockedColumns[i];
      const lockedData = this.lockableDataColumns.filter(entry => entry.orderId === column.orderId);

      for (let j = 0; j < lockedData.length; j++) {
        const dataCol = lockedData[j];
        dataCol.adjustStyles(column.locked);
      }
    }

    requestAnimationFrame(() => this.reorderColumns());
  }

  /**
   * Triggers when directive is destroyed
   *
   * @memberof IsLockableTable
   */
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
