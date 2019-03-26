import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { IsSearchInputEvent } from './table-paginator.model';
import { TABLEPAGINATOR_CONFIG } from './table-paginator.config';
import { IsTablePaginatorOptions } from './table-paginator-options';
import { mapProperties } from '../core/shared/utils/utils';

@Component({
  selector: 'is-table-paginator',
  templateUrl: 'table-paginator.html',
  styleUrls: ['table-paginator.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'is-table-paginator'
  }
})
export class IsTablePaginator implements OnInit, OnChanges {
  /**
   * Total number of pages
   */
  totalNumPages: number;

  /**
   * Whether or not search input is to be shown. Must be true/false. Default is
   * true.
   */
  private _showSearchInput = true;

  /**
   * Whether or not pagination is to be shown. Must be true/false. Default is
   * true.
   */
  private _showPaginator = true;

  /**
   * Whether or not export to excel icon is to be shown. Must be true/false.
   * Default is true.
   */
  private _showExcel = true;

  /**
   * Whether or not print icon is to be shown. Must be true/false. Default is
   * true.
   */
  private _showPrint = true;

  /**
   * Whether or not match case is to be shown. Must be true/false. Default is
   * true.
   */
  private _showMatchCase = true;

  /**
   * Total number of items in the table
   */
  @Input() collectionSize: number;

  /**
   * Whether or not export to excel icon is to be shown. Must be true/false.
   * Default is true.
   */
  @Input()
  get showExcel() {
    return this._showExcel;
  }

  set showExcel( value ) {
    this._showExcel = coerceBooleanProperty(value);
  }

  /**
   * Whether or not print icon is to be shown. Must be true/false. Default is
   * true.
   */
  @Input()
  get showPrint() {
    return this._showPrint;
  }

  set showPrint( value ) {
    this._showPrint = coerceBooleanProperty(value);
  }

  /**
   * Whether or not pagination is to be shown. Must be true/false. Default is
   * true.
   */
  @Input()
  get showPaginator() {
    return this._showPaginator;
  }

  set showPaginator( value ) {
    this._showPaginator = coerceBooleanProperty(value);
  }

  /**
   * Whether or not search input is to be shown. Must be true/false. Default is
   * true. should be used.
   */
  @Input()
  get showSearchInput() {
    return this._showSearchInput;
  }

  set showSearchInput( value ) {
    this._showSearchInput = coerceBooleanProperty(value);
  }

  /**
   * Whether or not search input's match case is to be shown. Must be true/false. Default is
   * true. should be used.
   */
  @Input()
  get showMatchCase() {
    return this._showMatchCase;
  }

  set showMatchCase( value ) {
    this._showMatchCase = coerceBooleanProperty(value);
  }

  /**
   * Current active page
   */
  @Input() currentPage = 1;

  /**
   * Size of each page
   */
  @Input() pageSize = 10;

  /**
   * Match case is-checkbox icon
   */
  @Input() matchCaseCheckedIcon = 'fa fa-check-square';

  /**
   * Options to be applied on the component when
   * the component will be declared.
   */
  @Input() options: IsTablePaginatorOptions;

  /**
   * Supports currentPage 2 way data binding
   * @hidden
   */
  @Output() currentPageChange = new EventEmitter<number>();

  /**
   * Page change event emitter
   */
  @Output() pageChange = new EventEmitter<number>();

  /**
   * On search event emitter
   */
  @Output() searchInput = new EventEmitter<IsSearchInputEvent>();

  /**
   * On search event emitter when ENTER key is pressed
   */
  @Output() searchInputSubmit = new EventEmitter<IsSearchInputEvent>();

  /**
   * On excel export event emitter
   * @hidden
   * @todo
   */
  @Output() excelExport = new EventEmitter<any>();

  /**
   * On refresh event emitter
   */
  @Output() refresh = new EventEmitter<any>();

  /**
   * On print event emitter
   */
  @Output() print = new EventEmitter<any>();

  /**
   * Whether or not match case flag is active
   */
  matchCase = false;

  /**
   * Search input string value
   */
  filterString = '';

  /**
   * Constructor of the component
   * @param globalConfig Global Options that will be
   * declared when invoking the module.
   */
  constructor( @Optional()
               @Inject(TABLEPAGINATOR_CONFIG)
               private globalConfig: IsTablePaginatorOptions ) {}

  /**
   * To be used to set the options on initialization.
   * @memberof IsTablePaginator
   */
  ngOnInit() {
    this.getOptions();
  }

  /**
   * On changes
   * @param changes
   */
  ngOnChanges( changes: SimpleChanges ): void {
    this.totalNumPages = this.getTotalPages();
  }

  /**
   * To be used to set the configuration options for table-paginator.
   */
  getOptions() {
    // should get default options.
    const defaultOptions = new IsTablePaginatorOptions();
    // should copy default options first then global options
    // and then will assign the page level options.
    const options = Object.assign(
      {},
      defaultOptions,
      this.globalConfig,
      this.options
    );

    mapProperties(options, {
      showExcel: this._showExcel,
      showPis: this._showExcel,
      showPrint: this._showPrint,
      showPaginator: this._showPaginator,
      showSearchInput: this._showSearchInput,
      showMatchCase: this._showMatchCase
    });
    this.options = options;
  }

  /**
   * Get total number of pages depending on collection size and page size
   */
  getTotalPages() {
    return Math.ceil(this.collectionSize / (this.pageSize || 1));
  }

  /**
   * Change page number
   * @param page
   */
  goToPage( page: number ) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.currentPageChange.emit(page);
      this.pageChange.emit(page);
    }
  }

  /**
   * Go to next page
   */
  goToNextPage() {
    if (!this.isLastPage()) {
      this.goToPage(this.currentPage + 1);
    }
  }

  /**
   * Go to previous page
   */
  goToPrevPage() {
    if (!this.isFirstPage()) {
      this.goToPage(this.currentPage - 1);
    }
  }

  /**
   * Whether or not the first page is active
   */
  isFirstPage() {
    return this.currentPage <= 1;
  }

  /**
   * Whether or not the last page is active
   */
  isLastPage() {
    return this.currentPage >= this.totalNumPages;
  }

  /**
   * Gets event object to be emitted
   */
  getEventData(): IsSearchInputEvent {
    return {
      keyword: this.filterString,
      matchCase: this.matchCase
    };
  }

  /**
   * On search input handler
   *
   * Tooltips need to be manually closed when the user removes all the
   * text inside the input field. If not, the buttons will disable and
   * and the tooltips will keep open even if the user (mouseleaves).
   * @param tooltipSearch - ref to the 'search' tooltip
   * @param tooltipClearSearch - ref to the 'clear search' tooltip
   */
  onSearchInput( tooltipSearch: NgbTooltip, tooltipClearSearch: NgbTooltip ) {
    if (this.filterString && this.filterString.trim()) {
      this.searchInput.next(this.getEventData());
    } else {
      tooltipSearch.close();
      tooltipClearSearch.close();
      this.onClearInput();
    }
  }

  /**
   * On search input ENTER key pressed handler
   */
  onSearchInputSubmit() {
    if (this.filterString && this.filterString.trim()) {
      this.searchInputSubmit.next(this.getEventData());
    }
  }

  /**
   * Filter cleaning
   */
  onClearInput() {
    this.filterString = '';
    const eventData = this.getEventData();

    this.searchInput.next(eventData);
    this.searchInputSubmit.next(eventData);
  }

  /**
   * Match case checkbox state change listener
   */
  onMatchCaseChange() {
    if (this.filterString && this.filterString.trim()) {
      const eventData = this.getEventData();
      this.searchInput.next(eventData);
      this.searchInputSubmit.next(eventData);
    }
  }

  /**
   * On excel export handler
   */
  onExcelExport() {
    this.excelExport.next();
  }

  /**
   * On refresh handler
   */
  onRefresh() {
    this.refresh.next();
  }

  /**
   * On print handler
   */
  onPrint() {
    this.print.next();
  }

  /**
   * On page change handler
   * @param ev
   */
  onPageChange( ev ) {
    let value = parseInt(ev.target.value, null);
    if (value > this.totalNumPages) {
      value = this.totalNumPages;
    } else if (value < 1) {
      value = 1;
    }
    ev.target.value = value;
    this.goToPage(value);
  }

  /**
   * Whether or not paginator input should be readonly
   */
  isReadOnlyPaginator() {
    return this.totalNumPages < 2;
  }
}
