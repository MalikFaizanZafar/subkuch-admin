import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  AfterViewInit,
  Input,
  HostBinding,
  HostListener,
  ElementRef,
  EmbeddedViewRef,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';
import { IsTableService } from '../table.service';
import { IsExpandableRowHTMLElement } from './expandable-row-html-element';

/**
 * Transition duration in milliseconds
 */
export const TRANSITION_DELAY_MS = 600;

/**
 * Directive to handle expansion
 * To check if row as auto expansion functionality
 * To check if row has custom expansion functionality
 * Emits events on expansion change, expansion start,
 * expansion end, collapse start and collapse end
 */
@Directive({
  selector: 'tr[is-expandable-row]'
})
export class IsExpandableRow implements AfterViewInit, OnChanges {
  /**
   * Class to help users if they want to style these rows
   */
  @HostBinding('class.is-expandable-row') defaultClass = true;

  /**
   * Configure the behavior of the auto-expand on row click
   */
  @Input() autoexpand = true;

  /**
   * The input data that the user is using in this table
   */
  @Input() data: any;

  /**
   * This is what is going to be rendered when the row expands
   */
  @Input() expandableContent: TemplateRef<any>;

  /**
   * Tracks the state of a row and adds a class accordingly
   */
  @Input()
  @HostBinding('class.is-expandable-row--expanded')
  expanded = false;

  /**
   * Property where the user stores the expanded state of the rows
   * Property not in use
   */
  @Input() expandedProp = '';

  /**
   * Event emitted when there is a change in the value of this.expanded
   * This is needed for the double binding of the [(expanded)] input
   */
  @Output() expandedChange = new EventEmitter();

  /**
   * Event triggered when the row is about to expand
   */
  @Output() onExpandStart = new EventEmitter();

  /**
   * Event triggered when the row finished expanded
   */
  @Output() onExpandEnd = new EventEmitter();

  /**
   * Event triggered when the row is about to collapse
   */
  @Output() onCollapseStart = new EventEmitter();

  /**
   * Event triggered when the row finished to collapse
   */
  @Output() onCollapseEnd = new EventEmitter();

  /**
   * Cursor to show depending on the value of this.autoexpand
   */
  @HostBinding('style.cursor') cursor = 'pointer';

  /**
   * This holds the ID of the current table
   */
  tableId: number;

  /**
   * Used to create the embedded view inside the directive
   */
  private embeddedTemplate: EmbeddedViewRef<any>;

  /**
   * Constructor method injects view container reference,
   * element reference and table service privately in class
   * @param vcr
   * @param el
   * @param isTable
   */
  constructor(
    private vcr: ViewContainerRef,
    private el: ElementRef,
    private isTable: IsTableService) {}

  /**
   * Initialization of the cursor, the expanded state and the tableId
   */
  ngAfterViewInit(): void {
    // This is a workaround for a well known issue when using ngAfterViewInit
    setTimeout(() => {
      this.cursor = (this.autoexpand) ? 'pointer' : '';
      this.expanded = false;
      this.tableId = this.el.nativeElement.getAttribute('table-id');
    }, 1);
  }

  /**
   * Updates the data just in case it has changed and updates the expanded state of the row
   * @param changes - changes detected
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('data')) {
      this.data = changes.data.currentValue;
    }

    if (changes.hasOwnProperty('expanded')) {
      if (changes.expanded.previousValue !== undefined) {
        this.toggleExpand();
      }
    }
  }

  /**
   * Callback when the user clicks a row
   *
   * @memberof IsExpandableRow
   * @param element - click target's parentElement
   */
  @HostListener('click', ['$event.target'])
  onMouseUp(element: IsExpandableRowHTMLElement): void {
    // in order to .toggleExpand, autoexpand must be true and element receiving
    // the click must not be is-expandable-row-avoider
    if (this.autoexpand && !element.expandableRowAvoider) {
      this.toggleExpand();
    }
  }

  /**
   * Decides whether a row should be opened / closed
   */
  toggleExpand(): void {
    if (!this.autoexpand) {
      this.expanded = !this.expanded;
    }

    if (!this.expanded) {
      const openedRow = this.isTable.getOpenedRow(this.tableId);
      if (openedRow && openedRow !== this) {
        openedRow.close();
      }
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Expands a row, embeds the template of the user and emits the events
   */
  private open() {
    this.embeddedTemplate = this.vcr.createEmbeddedView(this.expandableContent, {});
    this.embeddedTemplate.context.data = this.data;
    this.isTable.setOpenedRow(this);
    this.expanded = true;
    this.expandedChange.emit(this.expanded);
    this.onExpandStart.emit(this.data);
    setTimeout(() => {
      this.onExpandEnd.emit(this.data);
    }, TRANSITION_DELAY_MS);
  }

  /**
   * Collapses a row and emits the events
   */
  private close() {
    this.el.nativeElement.classList.add('is-expandable-row--closed');
    this.onCollapseStart.emit(this.data);

    setTimeout(() => {
      this.el.nativeElement.classList.remove('is-expandable-row--closed');
      this.vcr.clear();
      this.onCollapseEnd.emit(this.data);
    }, TRANSITION_DELAY_MS);

    /**
     * setTimeout To avoid ExpressionChangedAfterItHasBeenCheckedError
     */
    setTimeout(() => {
      this.expanded = false;
      this.expandedChange.emit(this.expanded);
    }, 0);
  }
}
