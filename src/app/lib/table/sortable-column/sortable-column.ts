import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewEncapsulation,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  HostListener
} from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { IsTableService } from '../table.service';
import { IsTableOrderingType } from '../table';
import { IsGridColumnFilterPopoverPlacement } from '../column-filter/popover-placement';

/**
 * Class that creates sortable column with
 * asc and desc arrows and filter button if
 * column is filterable
 * Sorts data on click of column
 */
@Component({
  selector: 'th[is-sortable-column]',
  templateUrl: './sortable-column.html',
  styleUrls: ['./sortable-column.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IsSortableColumn implements OnInit, AfterViewInit {
  /**
   * Popover view child
   */
  @ViewChild('popover') public popover: NgbPopover;

  /**
   * Order type
   * ASC or DESC
   */
  orderType: IsTableOrderingType;

  /**
   * Property that defines which key of the
   * object that represents a row in this table
   * will be used as the sorting index for this column.
   */
  @Input()
  sortBy: string;

  /**
   * Whether or not column should be sortable
   */
  @Input()
  sort: boolean;

  /**
   * Whether or not column should be filterable
   */
  @Input()
  filterable: boolean;

  /**
   * Event that gets emitted on change of filter
   */
  @Output()
  onFilterChange = new EventEmitter<any>();

  /**
   * Popover position following ngbPopover options.
   * Allowed values are: "top", "top-left", "top-right",
   * "bottom", "bottom-left", "bottom-right", "left",
   * "left-top", "left-bottom", "right", "right-top", "right-bottom".
   */
  @Input()
  placement: IsGridColumnFilterPopoverPlacement = IsGridColumnFilterPopoverPlacement.Bottom;

  /**
   * Fill color for the SVG that represents the icon for filtering a column.
   * This property is expected to be a color value.
   */
  @Input()
  filterFillColor: '#000000';

  /**
   * Table ID
   */
  tableId: number;

  /**
   * Event that gets emitted on sort change
   */
  @Output()
  onSort = new EventEmitter<any>();

  /**
   * Constructor method injects element reference and
   * table service in component
   * @param el
   * @param isTable
   */
  constructor(private el: ElementRef, private isTable: IsTableService) { }

  /**
   * Adds 'is-sortable-column' class to component
   * Emits onSort event if table id is same as
   * table id of instance invoking sor change event
   * and order property is same as component's 'sortBy'
   * property
   */
  ngOnInit() {
    this.filterable = this.filterable !== undefined;
    this.sort = this.sort === undefined || this.sort; // sort=True as default
    this.el.nativeElement.classList.add('is-sortable-column');
    this.isTable.$sortedPropertyChanged.subscribe(order => {
      if (order.tableId === this.tableId) {
        if (order.prop !== this.sortBy) {
          this.orderType = undefined;
        } else if (!this.orderType) {
          // if orderType is undefined, then it means this event was triggered
          // by the defaultOrder property.
          this.orderType = order.orderType;
          this.onSort.emit({
            property: this.sortBy,
            order: this.orderType
          });
        }
      }
    });
  }

  /**
   * Life cycle method called after view is initialized
   * sets component's table id
   * registers popover to table service
   */
  ngAfterViewInit() {
    setTimeout(() => { // makes sure that tableId prop is set in parentElement
      this.tableId = parseInt(this.el.nativeElement.parentElement.getAttribute('table-id'), 10);
      if (this.popover) {
        this.isTable.setPopover(this.popover, this.tableId);
      }
    });
  }

  /**
   * On click handler
   * Orders table and emits onSort event
   * with properties based on column clicked
   * @param event
   */
  @HostListener('click', ['$event'])
  onClick(event) {
    // Check that the user is not clicking any other button inside the header, for example a filter button
    if (event.target.tagName !== 'BUTTON'
      && event.target.tagName !== 'INPUT'
      && event.target.tagName !== 'LABEL'
      && !event.target.classList.contains('filter')) {
      this.toggleOrderType();
      this.isTable.orderTable(this.sortBy, this.orderType, this.sort, this.tableId);
      this.onSort.emit({
        property: this.sortBy,
        order: this.orderType
      });
    }
  }

  /**
   * Toggles order type between 'asc' and 'desc'
   */
  private toggleOrderType() {
    if (this.orderType === 'asc') {
      this.orderType = 'desc';
    } else {
      this.orderType = 'asc';
    }
  }

  /**
   * Checks if current column is filtered or not
   */
  isPropertyFiltered() {
    if (this.tableId) {
      return this.isTable.isPropertyFiltered(this.sortBy, this.tableId);
    }
    return false;
  }

  /**
   * Checks if popover is open or not
   */
  isPopoverOpen() {
    if (this.popover) {
      return this.popover.isOpen();
    }
    return false;
  }

  /**
   * Emits onFilterChange event
   * when onFilterchange event is received from
   * column-filter
   * @param event
   */
  filterChanged(event) {
    this.onFilterChange.emit(event);
  }
}
