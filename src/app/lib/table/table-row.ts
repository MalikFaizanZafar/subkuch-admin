import {
  Directive,
  ElementRef,
  AfterContentInit,
  ContentChildren,
  QueryList, Input
} from '@angular/core';
import { IsReorderableColumn } from './reorderable-table/reorderable-column';
import { IsLockableColumn } from './lockable-table/lockable-column';

/**
 * Directive for IsTable row
 */
@Directive({
  selector: 'tr[is-table-row]'
})
export class IsTableRow implements AfterContentInit {
  /**
   * Querylist of table columns
   * @memberof IsTableRow
   */
  @ContentChildren(IsReorderableColumn, { descendants: true })
  tableCols: QueryList<IsReorderableColumn>;

  @ContentChildren(IsLockableColumn, { descendants: true })
  tableLockableCols: QueryList<IsLockableColumn>;

  @Input()
  type: string;

  constructor(
    public el: ElementRef
  ) {}

  /**
   * Life cycle method call after content initialization
   * Adds order id to columns belonging to this row.
   * Adds order id to all IsReorderableColumn in dom.
   */
  ngAfterContentInit() {
    const tds = this.el.nativeElement.querySelectorAll('td');
    for (let  i = 0; i < tds.length; i++) {
      tds[i].setAttribute('order-id', i);
    }

    this.addReordabledOrderIds();

    // Add order ids to table col heads
    this.addLockableOrderIds();

    // Detect column changes and add order ids
    this.tableCols.changes.subscribe(res => {
      this.addReordabledOrderIds();
    });

    // Detect lockable column changes and add order ids
    this.tableLockableCols.changes.subscribe(res => {
      this.addLockableOrderIds();
    });
  }

  /**
   * Add order ids to Reordable columns
   * @memberof IsTableRow
   */
  addReordabledOrderIds() {
    this.tableCols.forEach((e, i) => {
      e.el.nativeElement.setAttribute('order-id', i);
    });
  }

  /**
   * Add order ids to Lockable columns
   *
   * @memberof IsTableRow
   */
  addLockableOrderIds() {
    this.tableLockableCols.forEach((e, i) => {
      e.element.nativeElement.setAttribute('order-id', i);
    });
  }

  /**
   * Rearrange columns regarding colOrder
   * @param colOrder
   * @memberof IsTableRow
   */
  rearrangeCols(colOrder: number[]) {
    colOrder.forEach(orderId => {
      const th = this.el.nativeElement.querySelector(`[order-id="${orderId}"]`);
      if (th) {
        this.el.nativeElement.appendChild(th);
      }
    });
  }
}
