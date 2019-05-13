import {
  AfterContentInit,
  ContentChildren,
  Directive,
  HostBinding,
  HostListener,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { IsTableRow } from '../table-row';
import { IsTableService } from '../table.service';
import { IsReorderableColumn } from './reorderable-column';

/**
 * Angular directive for IsTable
 * to make columns draggable and reorderable
 * @export
 */
@Directive({
  selector: 'table[is-reorderable-table]'
})
export class IsReorderableTable implements AfterContentInit, OnDestroy {
  /**
   * Appends is-reorderable-table class to the table
   */
  @HostBinding('class.is-reorderable-table')
  reorderableClass = true;

  /**
   * Index of dragged column
   */
  draggedColIndex: number | null = null;

  /**
   * Index of dropped column
   */
  droppedColIndex: number | null = null;

  /**
   * List of table column heads
   * @memberof IsReorderableTable
   */
  @ContentChildren(IsReorderableColumn, {descendants: true})
  tableColumns: QueryList<IsReorderableColumn>;

  /**
   * List of table rows
   * @memberof IsReorderableTable
   */
  @ContentChildren(IsTableRow, {descendants: true})
  tableRows: QueryList<IsTableRow>;

  /**
   * Table columns as an Array of IsReorderableColumn
   * @memberof IsReorderableTable
   */
  tableHeads: IsReorderableColumn[] = [];

  /**
   * Column ordering
   * @memberof IsReorderableTable
   */
  colOrder: number[] = [];

  /**
   * Wheather column is dragged or not
   * Appends is-reorderable-table--dragging class
   * to the table while dragging
   * @memberof IsReorderableTable
   */
  @HostBinding('class.is-reorderable-table--dragging')
  dragging = false;

  /**
   * An event fired on column reorder
   * @memberof IsReorderableTable
   */
  onTableReorder: Subject<any> = new Subject();

  /**
   * If the directive is active or not
   *
   * @memberof IsReorderableTable
   */
  isSetup = false;

  /**
   * Subject that emits a value when directive is destroyed
   *
   * @protected
   * @memberof IsReorderableTable
   */
  protected readonly $destroy = new Subject();

  /**
   * Subject that emits values when it is needed to clear subscriptions
   *
   * @protected
   * @memberof IsReorderableTable
   */
  protected readonly $clearSubscriptions = new Subject();

  /**
   * Creates an instance of IsReorderableTable.
   * @param service
   * @memberof IsReorderableTable
   */
  constructor( private service: IsTableService ) {}

  /**
   * Set dragging false on document mouse up
   * @memberof IsReorderableColumn
   */
  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
    this.clearDragging();
  }

  /**
   * Life cycle method called after
   * content initialization and
   * initializes all listeners
   */
  ngAfterContentInit() {
    this.service.$shouldDisableFeatures
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        shouldDisable => {
          if (shouldDisable && this.isSetup) {
            this.teardown();
          }
          if (!shouldDisable && !this.isSetup) {
            this.setup();
          }
        }
      );
  }

  /**
   * Setups the reorderable feature
   *
   * @memberof IsReorderableTable
   */
  setup() {
    this.initListeners();
    this.isSetup = true;
    // Detect if columns has been added or deleted
    this.tableColumns.changes
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.initListeners();
      });
    // Detect if rows has been added or deleted
    this.tableRows.changes
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.rearrangeCols();
      });
  }

  /**
   * Removes and disables the reorderable feature
   *
   * @memberof IsReorderableTable
   */
  teardown() {
    this.isSetup = false;
    this.$clearSubscriptions.next();
  }

  /**
   * Clear dragging flag on all columns
   */
  clearDragging() {
    for (let i = 0; i < this.tableHeads.length; i++) {
      this.tableHeads[i].dragging = false;
    }
  }

  /**
   * Listen on column dragstart
   * @memberof IsReorderableTable
   */
  initListeners() {
    this.$clearSubscriptions.next();

    this.tableHeads = this.tableColumns.toArray();

    this.tableHeads.forEach(( col: IsReorderableColumn, i: number ) => {
      col.parent = this;

      // Init columns order
      this.colOrder[i] = i;

      // Check if column is orderable
      if (col.isReorderableColumn) {
        // Subscribe to mouse down (drag start) event
        col.mouseDown
          .pipe(takeUntil(this.$clearSubscriptions))
          .subscribe(() => {
              this.dragging = true;
              this.draggedColIndex = this.tableHeads.indexOf(col);
            }
          );

        // Subscribe to mouse up (drag end) event
        col.mouseUp
          .pipe(takeUntil(this.$clearSubscriptions))
          .subscribe(res => {
              this.droppedColIndex = this.tableHeads.indexOf(col);

              // Reorder colorder array
              if (
                this.draggedColIndex !== null &&
                this.draggedColIndex !== this.droppedColIndex
              ) {
                this.tableHeads[this.draggedColIndex].dragging = false;
                this.moveCol(
                  this.draggedColIndex,
                  this.droppedColIndex,
                  res.side
                );
              }

              this.draggedColIndex = null;
            }
          );
      }
    });
  }

  /**
   * Move colorder array element
   * @param from
   * @param to
   * @param side
   * @memberof IsReorderableTable
   */
  moveCol( from, to, side ) {
    let _to = to;
    if (from < to) {
      this.move(this.tableHeads, from, to);
      this.move(this.colOrder, from, to);
    } else {
      if (side === 'left') {
        this.move(this.tableHeads, from, to);
        this.move(this.colOrder, from, to);
      } else {
        this.move(this.tableHeads, from, to + 1);
        this.move(this.colOrder, from, to + 1);
        _to = to + 1;
      }
    }
    this.rearrangeCols();
    this.onTableReorder.next({from, to: _to});
  }

  /**
   * Rearranges table columns
   * based on colOrder array
   * @memberof IsReorderableTable
   */
  rearrangeCols() {
    this.tableRows.forEach(row => {
      row.rearrangeCols(this.colOrder);
    });
  }

  /**
   * Function that moves Array element
   * from one place to another
   * @param array
   * @param old_index
   * @param new_index
   * @memberof IsReorderableTable
   */
  move( array: any[], old_index: number, new_index: number ) {
    if (new_index >= array.length) {
      let k = new_index - array.length;
      while (k-- + 1) {
        array.push(undefined);
      }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.$clearSubscriptions.next();
    this.$clearSubscriptions.complete();
    this.$destroy.next();
    this.$destroy.complete();
  }
}
