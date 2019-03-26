import { IsGridVirtualScrollEvent } from './scrollable-view/virtual-scroll-event';
import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
  OnInit,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  DoCheck,
  OnDestroy,
  ContentChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Renderer2,
  IterableDiffers,
  IterableDiffer,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import {
  IsGridColumn,
  IsGridHeader,
  IsGridHeaderColumnGroup,
  IsGridFooterColumnGroup,
  IsGridTemplate,
  IsGridFooter
} from './shared/index';
import {
  IsGridExportHandler,
  IsGridSortHandler,
  IsGridSelectHandler,
  IsGridFilterHandler,
  IsGridReorderHandler,
  IsGridEditorHandler,
  IsGridGroupHandler,
  IsGridResizeHandler,
  IsGridFilterMetadata,
  IsGridSortMeta,
  IsGridLazyLoadEvent,
  IsGridSortMode,
  IsGridSelectionMode,
  IsGridColumnResizeMode,
  IsGridPaginatorPosition,
  IsGridRowExpandMode,
  IsGridRowGroupMode,
  IsGridFilterMatchMode
} from './utils/index';
import { ObjectUtils } from './utils/object-utils';
import { Subscription } from 'rxjs/Subscription';
import { IsGridLifecycleHooks } from './grid-lifecycle-hooks';
import { IsGridManager } from './grid-manager';
import { DomHandler } from '../core/index';


@Component({
  selector: 'is-grid',
  templateUrl: './grid.html',
  styleUrls: ['./grid.scss'],
  providers: [DomHandler, ObjectUtils],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsGrid
  implements OnInit,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    DoCheck,
    OnDestroy {

  /**
   * Content child for grid headers.
   */
  @ContentChild(IsGridHeader)
  header: IsGridHeader;

  /**
   * Content child for grid columns.
   */
  @ContentChild(IsGridColumn)
  column: IsGridColumn;

  /**
   * Content child for grid footer.
   */
  @ContentChild(IsGridFooter)
  footer: IsGridFooter;

  /**
   * Content children for grid templates
   */
  @ContentChildren(IsGridTemplate)
  templates: QueryList<IsGridTemplate>;

  /**
   * Content children for grid columns
   */
  @ContentChildren(IsGridColumn)
  cols: QueryList<IsGridColumn>;

  /**
   * Content children for header column groups
   */
  @ContentChildren(IsGridHeaderColumnGroup)
  headerColumnGroups: QueryList<IsGridHeaderColumnGroup>;

  /**
   * Content children for footer column groups
   */
  @ContentChildren(IsGridFooterColumnGroup)
  footerColumnGroups: QueryList<IsGridFooterColumnGroup>;

  /**
   * Represents the class that manages the lifecycle hooks of the component
   */
  lifecycleHooksHandler: IsGridLifecycleHooks;

  /**
   * Represents the class that holds the grid logic
   */
  managerHandler: IsGridManager;

  /**
   * An array of objects to display.
   */
  _value: any[];

  /**
   * Data rendered in the actual grid
   */
  dataToRender: any[];

  /**
   * All grid columns
   */
  columns: IsGridColumn[];

  /**
   * Frozen columns only
   */
  frozenColumns: IsGridColumn[];

  /**
   * Scrollable columns only
   */
  scrollableColumns: IsGridColumn[];

  /**
   * Column group in the frozen header
   */
  frozenHeaderColumnGroup: IsGridHeaderColumnGroup;

  /**
   * Column group in the header that is scrollable
   */
  scrollableHeaderColumnGroup: IsGridHeaderColumnGroup;

  /**
   * Column group in the footer that is frozen
   */
  frozenFooterColumnGroup: IsGridFooterColumnGroup;

  /**
   * Column group in the footer that is scrollable
   */
  scrollableFooterColumnGroup: IsGridFooterColumnGroup;

  /**
   * Whether the columns changed
   */
  columnsChanged = false;

  /**
   * Representation of the tbody
   */
  tbody: any;

  /**
   * Height in px of the grid for virtual scrolling
   */
  virtualTableHeight: number;

  /**
   * Row group metadata
   */
  rowGroupMetadata: any;

  /**
   * TemplateRef for the row group in the header
   */
  rowGroupHeaderTemplate: TemplateRef<any>;

  /**
   * TemplateRef for the row group in the footer
   */
  rowGroupFooterTemplate: TemplateRef<any>;

  /**
   * TemplateRef that will be shown on row expansion
   */
  rowExpansionTemplate: TemplateRef<any>;

  /**
   * TemplateRef that will be shown when there's no data in the table
   */
  emptyMessageTemplate: TemplateRef<any>;

  /**
   * Scroll bar width in px
   */
  scrollBarWidth: number;

  /**
   * Zero-relative number of the first row to be displayed.
   */
  _first = 0;

  /**
   * Current displayed page.
   */
  currentPage = 1;

  /**
   * Whether to prevent row click event propagation or not
   */
  preventRowClickPropagation: boolean;

  /**
   * Iterable Differ used to detect data changes
   */
  differ: IterableDiffer<any>;

  /**
   * Cached number of total records
   */
  _totalRecords: number;

  /**
   * Keyup event listener for global filter
   */
  globalFilterFunction: any;

  /**
   * Columns changes subscription.
   */
  columnsSubscription: Subscription;

  /**
   * Total number of records changed
   */
  totalRecordsChanged: boolean;

  /**
   * Whether the grid is initialized
   */
  initialized: boolean;

  /**
   * Timer for virtual scrolling
   */
  virtualScrollTimer: any;

  /**
   * Wrapper element used on virtual scrolling
   */
  virtualScrollableTableWrapper: HTMLDivElement;

  /**
   * Callback function for virtual scrolling
   */
  virtualScrollCallback: Function;

  /**
   * Whether an edit has changed or not
   */
  editChanged: boolean;

  /**
   * Handler class for the sorting feature
   */
  sortHandler: IsGridSortHandler;

  /**
   * Handler class for the csv export feature
   */
  csvHandler: IsGridExportHandler;

  /**
   * Handler class for the select feature
   */
  selectHandler: IsGridSelectHandler;

  /**
   * Handler class for the data filtering feature
   */
  filterHandler: IsGridFilterHandler;

  /**
   * Handler class for the column reordering feature
   */
  reorderHandler: IsGridReorderHandler;

  /**
   * Handler class for the column resizing feature
   */
  resizeHandler: IsGridResizeHandler;

  /**
   * Handler class for the inline editing feature
   */
  editorHandler: IsGridEditorHandler;

  /**
   * Handler class for the column grouping feature
   */
  groupHandler: IsGridGroupHandler;

  /**
   * Event that emits when an edit action starts
   */
  @Output()
  editInit: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when an edit action completes
   */
  @Output()
  editComplete: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when an edit action is performed
   */
  @Output()
  edit: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when an edit action is canceled
   */
  @Output()
  editCancel: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on pagination activation
   */
  @Output()
  page: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when data sorting is triggered
   */
  @Output()
  sortEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when data filtering is triggered
   */
  @Output()
  filterEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when a value is changed
   */
  @Output()
  valueChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  /**
   * Event that emits on the first change of the grid data
   */
  @Output()
  firstChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Event that emits on row expansion
   */
  @Output()
  rowExpand: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row collapse
   */
  @Output()
  rowCollapse: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row group expansion
   */
  @Output()
  rowGroupExpand: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row group collapse
   */
  @Output()
  rowGroupCollapse: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row clicking
   */
  @Output()
  rowClick: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row selection change
   */
  @Output()
  selectionChange: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row select
   */
  @Output()
  rowSelect: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row unselect
   */
  @Output()
  rowUnselect: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on row double click
   */
  @Output()
  rowDblclick: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when the checkbox in the header are toggled
   */
  @Output()
  headerCheckboxToggle: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when selecting an item in the context menu
   */
  @Output()
  contextMenuSelect: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits when lazy load triggers
   */
  @Output()
  lazyLoad: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on column resizing
   */
  @Output()
  colResize: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on column reordering
   */
  @Output()
  colReorder: EventEmitter<any> = new EventEmitter();


  /**
   * Event that emits on paginator refresh event.
   */
  @Output()
  refresh: EventEmitter<any> = new EventEmitter();

  /**
   * Event that emits on paginator print event.
   */
  @Output()
  print: EventEmitter<any> = new EventEmitter();

  // Inputs

  /**
   * Whether to add paginator to the grid
   */
  @Input()
  paginator = false;

  /**
   * Number of rows shown in the grid when pagination is activated
   */
  @Input()
  rows: number;

  /**
   * Whether to modify the layout of the grid on mobile
   */
  @Input()
  responsive = false;

  /**
   * Whether to force the responsive layout even on Desktop
   */
  @Input()
  stacked = false;

  /**
   * Defines column based selection mode, options are "single" and "multiple".
   */
  @Input()
  get selectionMode(): IsGridSelectionMode {
    return this.selectHandler.selectionMode;
  }
  set selectionMode(val: IsGridSelectionMode) {
    this.selectHandler.selectionMode = val;
  }

  /**
   * Whether incell editing is enabled.
   * Default: false
   */
  @Input()
  get editable(): boolean {
    return this.editorHandler.editable;
  }
  set editable(val: boolean) {
    this.editorHandler.editable = val;
  }

  /**
   * Delay in milliseconds before filtering the data.
   * Default: 300
   */
  @Input()
  get filterDelay(): number {
    return this.filterHandler.filterDelay;
  }
  set filterDelay(val: number) {
    this.filterHandler.filterDelay = val;
  }

  /**
   * Whether columns can be resized using drag and drop.
   */
  @Input()
  resizableColumns = false;

  /**
   * Defines whether the overall table width should change on column resize, valid values are "fit" and "expand".
   */
  @Input()
  get columnResizeMode(): IsGridColumnResizeMode {
    return this.resizeHandler.columnResizeMode;
  }
  set columnResizeMode(val: IsGridColumnResizeMode) {
    this.resizeHandler.columnResizeMode = val;
  }

  /**
   * Whether data should be loaded and interacted with in lazy manner.
   */
  @Input()
  lazy = false;

  /**
   * Whether to show the header checkbox in checkbox based selection mode
   */
  @Input()
  showHeaderCheckbox = true;

  /**
   * When set to true, the header checkbox on paged Grid with checkbox multiple selection
   * enabled will toggle the selection of items across all pages
   */
  @Input()
  headerCheckboxToggleAllPages = false;

  /**
   * Whether the grid has reorderable columns.
   */
  @Input()
  get reorderableColumns(): boolean {
    return this.reorderHandler.reorderableColumns;
  }
  set reorderableColumns(val: boolean) {
    this.reorderHandler.reorderableColumns = val;
  }

  /**
   * Whether the grid is scrollable.
   */
  @Input()
  scrollable: boolean;

  /**
   * Whether the data should be loaded on demand during scroll
   */
  @Input()
  virtualScroll: boolean;

  /**
   * Height of the scroll viewport.
   */
  @Input()
  scrollHeight: string;

  /**
   * Width of the scroll viewport.
   */
  @Input()
  scrollWidth: string;

  /**
   * Width of the frozen section of the grid
   */
  @Input()
  frozenWidth: string;

  /**
   * Width of the unfrozen section of the grid
   */
  @Input()
  unfrozenWidth: string;

  /**
   * Whether the columns are lockable.
   */
  @Input()
  lockable = false;

  /**
   * Inline CSS style for the grid.
   */
  @Input()
  style: any;

  /**
   * CSS style class for the grid.
   */
  @Input()
  styleClass: string;

  /**
   * CSS styles for the grid table
   */
  @Input()
  tableStyle: string;

  /**
   * CSS class for the grid table
   */
  @Input()
  tableStyleClass: string;

  /**
   * Reference of an input field to use as a global filter.
   */
  @Input()
  get globalFilter(): HTMLInputElement {
    return this.filterHandler.globalFilter;
  }

  set globalFilter(val: HTMLInputElement) {
    this.filterHandler.globalFilter = val;
  }

  /**
   * Defines whether sorting works on single column or on multiple columns. Valid values are "single" and "multiple".
   */
  @Input()
  get sortMode(): IsGridSortMode {
    return this.sortHandler.sortMode;
  }
  set sortMode(val: IsGridSortMode) {
    this.sortHandler.sortMode = val;
  }

  /**
   * Sort order to use when an unsorted column gets sorted by user interaction.
   */
  @Input()
  get defaultSortOrder(): number {
    return this.sortHandler.defaultSortOrder;
  }

  set defaultSortOrder(val: number) {
    this.sortHandler.defaultSortOrder = val;
  }

  /**
   * Name of the field to group by in subHeader row grouping mode.
   */
  @Input()
  get groupField(): string {
    return this.groupHandler.groupField;
  }
  set groupField(val: string) {
    this.groupHandler.groupField = val;
  }

  /**
   * Local ng-template variable of a IsContextMenu.
   */
  @Input()
  contextMenu: any;

  /**
   * Character to use as the csv separator.
   */
  @Input()
  csvSeparator = ',';

  /**
   * Exported CSV file name.
   */
  @Input()
  exportFilename = 'download';

  /**
   * Text to display when there is no data.
   */
  @Input()
  emptyMessage = 'No records found';

  /**
   * Paginator position, valid values are "top" and "bottom".
   */
  @Input()
  paginatorPosition: IsGridPaginatorPosition = 'bottom';

  /**
   * Whether to show it even there is only one page.
   */
  @Input()
  alwaysShowPaginator = true;

  /**
   * Defines whether metaKey is required or not for the selection.
   * When true metaKey needs to be pressed to select or unselect an item
   * and when set to false selection of each item can be toggled individually.
   * On touch enabled devices, metaKeySelection is turned off automatically.
   */
  @Input()
  get metaKeySelection(): boolean {
    return this.selectHandler.metaKeySelection;
  }
  set metaKeySelection(val: boolean) {
    this.selectHandler.metaKeySelection = val;
  }

  /**
   * Defines how the data should be manipulated.
   */
  @Input()
  immutable = true;

  /**
   * A collection to display as frozen in a scrollable table.
   */
  @Input()
  frozenValue: any[];

  /**
   * Algorithm to define if a row is selected.
   * Valid values are "equals" that compares by reference and "deepEquals" that compares all fields.
   */
  @Input()
  get compareSelectionBy(): string {
    return this.selectHandler.compareSelectionBy;
  }
  set compareSelectionBy(val: string) {
    this.selectHandler.compareSelectionBy = val;
  }

  /**
   * Whether the grid has expandable rows.
   */
  @Input()
  expandableRows: boolean;

  /**
   * Collection of rows to display as expanded.
   */
  @Input()
  get expandedRows(): any[] {
    return this.groupHandler.expandedRows;
  }
  set expandedRows(val: any[]) {
    this.groupHandler.expandedRows = val;
  }

  /**
   * When enabled, adds a clickable icon at group header to expand or collapse the group.
   */
  @Input()
  expandableRowGroups: boolean;

  /**
   * Whether multiple rows can be expanded at any time. Valid values are "multiple" and "single".
   */
  @Input()
  get rowExpandMode(): IsGridRowExpandMode {
    return this.groupHandler.rowExpandMode;
  }
  set rowExpandMode(val: IsGridRowExpandMode) {
    this.groupHandler.rowExpandMode = val;
  }

  /**
   * Whether multiple row groups can be expanded at any time. Valid values are "multiple" and "single".
   */
  @Input()
  get expandedRowsGroups(): any[] {
    return this.groupHandler.expandedRowsGroups;
  }
  set expandedRowsGroups(val: any[]) {
    this.groupHandler.expandedRowsGroups = val;
  }

  /**
   * Row toggler icon of an expanded row toggler.
   */
  @Input()
  expandedIcon = 'fa-chevron-down';

  /**
   * Row toggler icon of a collapsed row toggler.
   */
  @Input()
  collapsedIcon = 'fa-chevron-right';

  /**
   * IsGridColumnHeaders tabindex property.
   */
  @Input()
  tabindex = 1;

  /**
   * Function that gets the row data and row index as parameters and returns a style class for the row.
   * This is an alternative to the rowStyleMap approach.
   */
  @Input()
  rowStyleClass: Function;

  /**
   * An object whose keys are dataKeys of a row and values are the corresponding style class of that row.
   * This is an alternative to the rowStyleClass approach.
   */
  @Input()
  rowStyleMap: Object;

  /**
   * Type of the row grouping, valid values are "subheader" and "rowspan".
   */
  @Input()
  rowGroupMode: IsGridRowGroupMode;

  /**
   * Whether to sort the data if the row group subHeader is clicked.
   */
  @Input()
  sortableRowGroup = true;

  /**
   * Adds hover effect to rows without the need for selectionMode.
   */
  @Input()
  rowHover: boolean;

  /**
   * An array of IsGridFilterMetadata objects to provide external filters.
   */
  @Input()
  get filters(): { [s: string]: IsGridFilterMetadata } {
    return this.filterHandler.filters;
  }
  set filters(val: { [s: string]: IsGridFilterMetadata }) {
    this.filterHandler.filters = val;
  }

  /**
   * A property to uniquely identify a record in data.
   */
  @Input()
  get dataKey(): string {
    return this.selectHandler.dataKey;
  }
  set dataKey(val: string) {
    this.selectHandler.dataKey = val;
  }

  /**
   * Displays a loader to indicate data load is in progress.
   */
  @Input()
  loading: boolean;

  /**
   * loader label.
   */
  @Input()
  loadingMessage = 'loading';

  /**
   * Delay in virtual scroll before doing a call to lazy load.
   */
  @Input()
  virtualScrollDelay = 500;

  /**
   * Whether multiple row groups can be expanded at any time. Valid values are "multiple" and "single".
   */
  @Input()
  get rowGroupExpandMode(): IsGridRowExpandMode {
    return this.groupHandler.rowGroupExpandMode;
  }

  set rowGroupExpandMode(val: IsGridRowExpandMode) {
    this.groupHandler.rowGroupExpandMode = val;
  }

  /**
   * 	An array of IsGridSortMeta objects to sort the data by default in multiple sort mode.
   */
  @Input()
  get multiSortMeta(): IsGridSortMeta[] {
    return this.sortHandler.multiSortMeta;
  }

  set multiSortMeta(val: IsGridSortMeta[]) {
    this.sortHandler.multiSortMeta = val;
    if (this.sortMode === 'multiple') {
      this.sortMultiple();
    }
  }

  /**
   * Name of the field to sort data by default.
   */
  @Input()
  get sortField(): string {
    return this.sortHandler.sortField;
  }

  set sortField(val: string) {
    this.sortHandler.sortField = val;
    if (this.sortMode === 'single') {
      this.sortSingle();
    }
  }

  /**
   * Order to sort when default sorting is enabled.
   */
  @Input()
  get sortOrder(): number {
    return this.sortHandler.sortOrder;
  }
  set sortOrder(val: number) {
    this.sortHandler.sortOrder = val;
    if (this.sortMode === 'single') {
      this.sortSingle();
    }
  }

  /**
   * An array of objects to display.
   */
  @Input()
  get value(): any[] {
    return this._value;
  }
  set value(val: any[]) {
    if (this.immutable) {
      this._value = val ? [...val] : null;
      this.managerHandler.handleDataChange();
    } else {
      this._value = val;
    }

    this.valueChange.emit(this.value);
  }

  /**
   * Index of the first row to be displayed. It supports two-way binding so that model value can be updated on pagination as well.
   * Default: 0.
   */
  @Input()
  get first(): number {
    return this._first;
  }

  set first(val: number) {
    const shouldPaginate = this.initialized && this._first !== val;

    this._first = val;

    if (shouldPaginate) {
      this.paginate();
    }
  }

  /**
   * Number of total records, defaults to length of value when not defined.
   */
  @Input()
  get totalRecords(): number {
    return this._totalRecords;
  }

  set totalRecords(val: number) {
    this._totalRecords = val;
    this.totalRecordsChanged = true;
  }

  /**
   * Selected row in single mode or an array of values in multiple mode.
   */
  @Input()
  get selection(): any {
    return this.selectHandler.selection;
  }
  set selection(val: any) {
    this.selectHandler.selection = val;

    if (this.dataKey && !this.selectHandler.preventSelectionKeysPropagation) {
      this.selectHandler.selectionKeys = {};
      if (this.selectHandler.selection) {
        if (Array.isArray(this.selectHandler.selection)) {
          for (const data of this.selectHandler.selection) {
            this.selectHandler.selectionKeys[
              String(this.objectUtils.resolveFieldData(data, this.dataKey))
            ] = 1;
          }
        } else {
          this.selectHandler.selectionKeys[
            String(
              this.objectUtils.resolveFieldData(
                this.selectHandler.selection,
                this.dataKey
              )
            )
          ] = 1;
        }
      }
    }
    this.selectHandler.preventSelectionKeysPropagation = false;
  }

  /**
   * Function to optimize the dom operations by delegating to ngForTrackBy, default algorithm checks for object identity.
   */
  @Input()
  rowTrackBy: Function = (index: number, item: any) => item

  /**
   * Constructor method injects element reference in component and initializes the grid handlers.
   * @param el
   * @param domHandler
   * @param differs
   * @param renderer
   * @param changeDetector
   * @param objectUtils
   * @param zone
   */
  constructor(
    public el: ElementRef,
    public domHandler: DomHandler,
    public differs: IterableDiffers,
    public renderer: Renderer2,
    public changeDetector: ChangeDetectorRef,
    public objectUtils: ObjectUtils,
    public zone: NgZone
  ) {
    this.lifecycleHooksHandler = new IsGridLifecycleHooks(this);
    this.managerHandler = new IsGridManager(this, this.changeDetector);
    this.sortHandler = new IsGridSortHandler(this.objectUtils);
    this.csvHandler = new IsGridExportHandler(this.objectUtils);
    this.selectHandler = new IsGridSelectHandler(
      this.selectionChange,
      this.rowSelect,
      this.rowUnselect,
      this.objectUtils,
      this.domHandler
    );
    this.filterHandler = new IsGridFilterHandler(this.objectUtils);
    this.reorderHandler = new IsGridReorderHandler(
      this.colReorder,
      this.objectUtils,
      this.domHandler,
      this.zone,
      this.el
    );
    this.resizeHandler = new IsGridResizeHandler(
      this.colResize,
      this.objectUtils,
      this.domHandler,
      this.zone,
      this.el,
      this.renderer
    );
    this.editorHandler = new IsGridEditorHandler(
      this.editInit,
      this.domHandler,
      this.renderer
    );
    this.groupHandler = new IsGridGroupHandler(
      this.rowCollapse,
      this.rowExpand,
      this.rowGroupCollapse,
      this.rowGroupExpand,
      this.objectUtils
    );

    this.differ = differs.find([]).create(null);
  }

  /**
   * Lifecycle method called on component initialization.
   * Initializes grid using lifecycleHooksHandler onInit function.
   */
  ngOnInit() {
    this.lifecycleHooksHandler.onInit();
  }

  /**
   * Lifecycle method called after component content initialization
   * Initializes grid using lifecycleHooksHandler afterContentInit function.
   */
  ngAfterContentInit() {
    this.lifecycleHooksHandler.afterContentInit();
  }

  /**
   * Lifecycle method called after component view checked
   * Initializes grid using lifecycleHooksHandler afterViewChecked function.
   */
  ngAfterViewChecked() {
    this.lifecycleHooksHandler.afterViewChecked();
  }

  /**
   * Lifecycle method called after component view initialization
   * Initializes grid using lifecycleHooksHandler afterViewInit function.
   */
  ngAfterViewInit() {
    this.lifecycleHooksHandler.afterViewInit();
  }

  /**
   * Detects changes to properties.
   */
  ngDoCheck() {
    this.lifecycleHooksHandler.doCheck();
  }

  /**
   * Lifecycle method called on component destruction
   * Destroy grid using lifecycleHooksHandler onDestroy function.
   */
  ngOnDestroy() {
    this.lifecycleHooksHandler.onDestroy();
  }

  /**
   * Configure columns
   */
  initColumns() {
    this.columns = this.cols.toArray();
    this.initScrollableColumns();
    this.columnsChanged = true;
  }

  /**
   * Configure the behaviour of both scrollable and frozen columns
   */
  initScrollableColumns() {
    this.scrollableColumns = [];
    this.frozenColumns = [];

    for (const col of this.columns) {
      if (col.frozen) {
        this.frozenColumns.push(col);
      } else {
        this.scrollableColumns.push(col);
      }
    }
  }

  /**
   * Configure behaviour of column grouping
   */
  initColumnGroups() {
    const headerColumnsGroups = this.headerColumnGroups.toArray();
    const footerColumnsGroups = this.footerColumnGroups.toArray();
    for (const columnGroup of headerColumnsGroups) {
      if (columnGroup.frozen) {
        this.frozenHeaderColumnGroup = columnGroup;
      } else {
        this.scrollableHeaderColumnGroup = columnGroup;
      }
    }
    for (const columnGroup of footerColumnsGroups) {
      if (columnGroup.frozen) {
        this.frozenFooterColumnGroup = columnGroup;
      } else {
        this.scrollableFooterColumnGroup = columnGroup;
      }
    }
  }

  /**
   * Returns the value inside `data` given its deep path via `field` param.
   * e.g. it's a shortcut to retrieve things like data[deep.field.path]
   * @param data - the object where the value must be retrieved from
   * @param field - deep path to the value requested
   * @returns data[field]
   */
  resolveFieldData(data: any, field: string): any {
    return this.objectUtils.resolveFieldData(data, field);
  }

  /**
   * Updates paginator total records, number of pages and first.
   */
  updatePaginator() {
    // total records
    this.updateTotalRecords();
    // first
    if (this.totalRecords && this.first >= this.totalRecords) {
      const numberOfPages = Math.ceil(this.totalRecords / this.rows);
      this._first = Math.max((numberOfPages - 1) * this.rows, 0);
    }
  }

  /**
   * Update the total number of records dependending on whether `lazy`
   * is enabled or not
   */
  updateTotalRecords() {
    this.totalRecords = this.lazy
      ? this.totalRecords
      : this.value ? this.value.length : 0;
  }

  /**
   * Callback function on paginator page change event.
   */
  onPageChange(event) {
    this._first = (event - 1) * this.rows;
    this.firstChange.emit(this.first);
    this.paginate();
  }

  /**
   * Handles pagination for both lazy and non-lazy use cases
   * and emits the corresponding event
   */
  paginate() {
    if (this.lazy) {
      this.lazyLoad.emit(this.createLazyLoadMetadata());
    } else {
      this.managerHandler.updateDataToRender(this.filterHandler.filteredValue || this.value);
    }

    this.page.emit({
      first: this.first,
      rows: this.rows
    });
  }

  /**
   * Handles scrolling event for virtual scrolling
   * @param event
   */
  onVirtualScroll(event: IsGridVirtualScrollEvent) {
    this._first = (event.page - 1) * this.rows;
    this.virtualScrollCallback = event.callback;

    this.zone.run(() => {
      if (this.virtualScrollTimer) {
        clearTimeout(this.virtualScrollTimer);
      }

      this.virtualScrollTimer = setTimeout(() => {
        if (this.lazy) {
          this.lazyLoad.emit(this.createLazyLoadMetadata());
        } else {
          this.managerHandler.updateDataToRender(
            this.filterHandler.filteredValue || this.value
          );
        }
      }, this.virtualScrollDelay);
    });
  }

  /**
   * Handles keydown event on header
   * @param event
   * @param column
   */
  onHeaderKeydown(event: KeyboardEvent, column: IsGridColumn) {
    if (event.keyCode === 13) {
      this.sort(event, column);
      event.preventDefault();
    }
  }

  /**
   * TODO
   * @param event
   * @param header
   */
  onHeaderMousedown(event: MouseEvent, header: any) {
    if (this.reorderableColumns) {
      const nodeName = (event.target as Node).nodeName;
      header.draggable = nodeName !== 'INPUT';
    }
  }

  /**
   * If a column is sortable, calls the sort function and emits a sortEvent.
   * @param event
   * @param column
   */
  sort(event, column: IsGridColumn) {
    if (!column.sortable) {
      return;
    }
    const targetNode = event.target;
    if (
      this.domHandler.hasClass(targetNode, 'is-grid-column--sortable') ||
      this.domHandler.hasClass(targetNode, 'is-grid-column__title') ||
      this.domHandler.hasClass(targetNode, 'is-grid-column--sortable__icon')
    ) {
      this.sortHandler.sort(
        event,
        column,
        this.value,
        this.immutable,
        this.lazy
      );
      if (this.lazy) {
        this._first = 0;
        this.lazyLoad.emit(this.createLazyLoadMetadata());
      }
      this.sortEvent.emit({
        field: this.sortField,
        order: this.sortOrder,
        multisortmeta: this.multiSortMeta
      });
      this.managerHandler.updateDataToRender(this.filterHandler.filteredValue || this.value);
    }
  }

  /**
   * Gets the sort order for a column. Calls the sortHandler getSortOrder function.
   * @param column
   */
  getSortOrder(column: IsGridColumn) {
    return this.sortHandler.getSortOrder(column);
  }

  /**
   * Handle single column sorting
   */
  sortSingle() {
    if (this.value) {
      this.sortHandler.sortSingle(this.value);
      this._first = 0;
      if (this.filterHandler.hasFilter()) {
        this._filter(false);
      }
    }
  }

  /**
   * Handle multiple column sorting
   */
  sortMultiple() {
    if (this.value) {
      this.sortHandler.sortMultiple(this.value);
      if (this.filterHandler.hasFilter()) {
        this._filter(false);
      }
    }
  }

  /**
   * Whether or not a column is sorted.
   * @param column
   */
  isSorted(column: IsGridColumn) {
    this.sortHandler.isSorted(column);
  }

  /**
   * Handles row group clicking
   * @param event - click event
   * @returns
   */
  onRowGroupClick(event: MouseEvent) {
    if (this.groupHandler.rowGroupToggleClick) {
      this.groupHandler.rowGroupToggleClick = false;
      return;
    }

    if (this.sortableRowGroup) {
      const targetNode = (event.target as Node).nodeName;
      if (
        targetNode === 'TD' ||
        (targetNode === 'SPAN' &&
          !this.domHandler.hasClass(event.target, 'is-grid-clickable'))
      ) {
        if (this.sortField !== this.groupHandler.groupField) {
          this.sortHandler.sortField = this.groupHandler.groupField;
          this.sortSingle();
        } else {
          this.sortHandler.sortOrder = -1 * this.sortOrder;
          this.sortSingle();
        }
      }
    }
  }

  /**
   * Handles click on grid row
   * @param event
   * @param rowData
   * @param index
   */
  handleRowClick(event: MouseEvent, rowData: any, index: number) {
    if (this.preventRowClickPropagation) {
      this.preventRowClickPropagation = false;
      return;
    }

    const targetNode = (<HTMLElement> event.target).nodeName;

    if (
      targetNode === 'INPUT' ||
      targetNode === 'BUTTON' ||
      targetNode === 'A' ||
      this.domHandler.hasClass(event.target, 'is-grid-clickable')
    ) {
      return;
    }

    this.rowClick.next({ originalEvent: event, data: rowData });
    this.selectHandler.handleRowclick(event, rowData, index, this.dataToRender);

    this.selectHandler.rowTouched = false;
  }

  /**
   * Handles touch end event on a grid row
   * @param event
   */
  handleRowTouchEnd(event: Event) {
    this.selectHandler.rowTouched = true;
  }

  /**
   * Single select of a row using radio button.
   * @param event
   * @param rowData
   */
  selectRowWithRadio(event: Event, rowData: any) {
    this.selectHandler.selectRowWithRadio(event, rowData);
    this.preventRowClickPropagation = true;
  }

  /**
   * Toggles the checked status for the checkbox of a row.
   * @param event
   * @param rowData
   */
  toggleRowWithCheckbox(event, rowData: any) {
    this.selectHandler.toggleRowWithCheckbox(event, rowData);
    this.preventRowClickPropagation = true;
  }

  /**
   * Toggles the checked status for the checkboxes of all the rows.
   * @param event
   */
  toggleRowsWithCheckbox(event) {
    if (event.checked) {
      this.selectHandler.selection = this.headerCheckboxToggleAllPages
        ? this.value.slice()
        : this.dataToRender.slice();
    } else {
      this.selectHandler.selection = [];
    }

    this.selectionChange.emit(this.selectHandler.selection);

    this.headerCheckboxToggle.emit({
      originalEvent: event,
      checked: event.checked
    });
  }

  /**
   * Handles the right click event in a row. If there is a context menu , open the context menu and emit an event with the row data.
   * @param event
   * @param rowData
   */
  onRowRightClick(event, rowData) {
    if (this.contextMenu) {
      const selectionIndex = this.selectHandler.findIndexInSelection(rowData);
      const selected = selectionIndex !== -1;

      if (!selected) {
        if (this.selectHandler.isSingleSelectionMode()) {
          this.selection = rowData;
          this.selectionChange.emit(rowData);
        } else if (this.selectHandler.isMultipleSelectionMode()) {
          this.selection = [rowData];
          this.selectionChange.emit(this.selection);
        }

        if (this.dataKey) {
          this.selectHandler.selectionKeys[
            String(this.resolveFieldData(rowData, this.dataKey))
          ] = 1;
          this.selectHandler.preventSelectionKeysPropagation = true;
        }
      }

      this.contextMenu.show(event);
      this.contextMenuSelect.emit({ originalEvent: event, data: rowData });
    }
  }

  /**
   * Event emitter for a double click event in a row.
   * @param event
   * @param rowData
   */
  _rowDblclick(event, rowData) {
    this.rowDblclick.emit({ originalEvent: event, data: rowData });
  }

  /**
   * Whether the grid has selected all the rows.
   * @readonly
   */
  get allSelected() {
    if (this.headerCheckboxToggleAllPages) {
      return (
        this.selection &&
        this.value &&
        this.selection.length === this.value.length
      );
    } else {
      let val = true;
      if (
        this.dataToRender &&
        this.selection &&
        this.dataToRender.length <= this.selection.length
      ) {
        for (const data of this.dataToRender) {
          if (!this.selectHandler.isSelected(data)) {
            val = false;
            break;
          }
        }
      } else {
        val = false;
      }
      return val;
    }
  }

  /**
   * Whether or not a row is selected.
   * @param rowData
   * @returns
   */
  isSelected(rowData) {
    return this.selectHandler.isSelected(rowData);
  }

  /**
   * Filters grid data
   * @param value
   * @param field
   * @param matchMode
   * @param inputValue
   */
  filter(value: any, field: string, matchMode: IsGridFilterMatchMode, inputValue: any) {
    this.filterHandler.filter(value, field, matchMode, inputValue);
    this._filter(false);
  }

  /**
   * Filters grid data based on the flag `matchCase` and emits
   * the filter event.
   */
  _filter(matchCase: boolean) {
    this._first = 0;

    if (this.lazy) {
      this.lazyLoad.emit(this.createLazyLoadMetadata());
    } else {
      if (!this.value || !this.columns) {
        return;
      }
      this.filterHandler._filter(this.value, this.columns, matchCase);
      if (this.paginator) {
        this.totalRecords = this.filterHandler.filteredValue
          ? this.filterHandler.filteredValue.length
          : this.value ? this.value.length : 0;
      }

      this.managerHandler.updateDataToRender(this.filterHandler.filteredValue || this.value);
    }
    this.filterEvent.emit({
      filters: this.filters,
      filteredValue: this.filterHandler.filteredValue || this.value
    });
  }

  /**
   * Handles filter click event
   * @param event - mouse event
   */
  onFilterInputClick(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * Switches to inline edit mode
   * @param cell
   * @param column
   * @param rowData
   */
  switchCellToEditMode(cell: any, column: IsGridColumn, rowData: any) {
    if (!this.selectionMode && this.editable && column.editable) {
      this.editorHandler.switchCellToEditMode(cell, column, rowData);
    }
  }

  /**
   * Handles keydown events when editing grid cells
   * @param event
   * @param column
   * @param rowData
   * @param rowIndex
   */
  onCellEditorKeydown(
    event: KeyboardEvent,
    column: IsGridColumn,
    rowData: any,
    rowIndex: number
  ) {
    this.editorHandler.onCellEditorKeydown(event, column, rowData, rowIndex);
  }

  /**
   * Handles input events when editing grid cells
   * @param event
   * @param Column
   * @param owData
   * @param rowIndex
   */
  onCellEditorInput(
    event: Event,
    column: IsGridColumn,
    rowData: any,
    rowIndex: number
  ) {
    if (this.editable) {
      this.edit.emit({
        originalEvent: event,
        column: column,
        data: rowData,
        index: rowIndex
      });
    }
  }

  /**
   * Handles change evens when editing grid cells
   * @param event
   * @param column
   * @param rowData
   * @param rowIndex
   */
  onCellEditorChange(
    event: Event,
    column: IsGridColumn,
    rowData: any,
    rowIndex: number
  ) {
    if (this.editable) {
      this.editChanged = true;

      this.editComplete.emit({
        column: column,
        data: rowData,
        index: rowIndex
      });
    }
  }

  /**
   * Handles blur evens when editing grid cells
   * @param event
   * @param column
   * @param rowData
   * @param rowIndex
   */
  onCellEditorBlur(
    event,
    column: IsGridColumn,
    rowData: any,
    rowIndex: number
  ) {
    if (this.editable) {
      if (this.editChanged) {
        this.editChanged = false;
      } else {
        this.editCancel.emit({
          column: column,
          data: rowData,
          index: rowIndex
        });
      }
    }
  }

  /**
   * When inline edition is enabled, this method will
   * move focus to the previous cell
   * @param event
   */
  moveToPreviousCell(event: KeyboardEvent) {
    this.editorHandler.moveToPreviousCell(event);
  }

  /**
   * Listens to prev focus keyboard event
   * @param event
   */
  onCustomEditorFocusPrev(event: KeyboardEvent) {
    this.moveToPreviousCell(event);
  }

  /**
   * Listens to next focus keyboard event
   * @param event
   */
  onCustomEditorFocusNext(event: KeyboardEvent) {
    this.editorHandler.moveToNextCell(event);
  }

  /**
   * Configures the resizable column behaviour
   * @param event
   */
  initResizableColumns() {
    this.tbody = this.domHandler.findSingle(
      this.el.nativeElement,
      'tbody.is-grid__data'
    );
    this.resizeHandler.resizerHelper = this.domHandler.findSingle(
      this.el.nativeElement,
      'div.is-grid__resizer-helper'
    );
    this.managerHandler.fixColumnWidths();
  }

  /**
   * Handles the mouse move event for column resizing functionality.
   * @param event
   */
  onDocumentMouseMove(event: MouseEvent) {
    if (this.resizeHandler.columnResizing) {
      this.onColumnResize(event);
    }
  }

  /**
   * Handles the mouse up event for column resizing functionality.
   * @param event
   */
  onDocumentMouseUp(event: MouseEvent) {
    if (this.resizeHandler.columnResizing) {
      this.resizeHandler.columnResizing = false;
      this.onColumnResizeEnd(event);
    }
  }

  /**
   * Initializes the column resizing workflow
   * @param event
   */
  initColumnResize(event: MouseEvent) {
    this.resizeHandler.initColumnResize(event, this.scrollable, this.tbody);
  }

  /**
   * Handles column resize event
   * @param event
   */
  onColumnResize(event: MouseEvent) {
    this.resizeHandler.onColumnResize(event);
  }

  /**
   * Handles column resize end event
   * @param event
   */
  onColumnResizeEnd(event) {
    this.resizeHandler.onColumnResizeEnd(event, this.scrollable, this.tbody);
  }

  /**
   * Handles column drag start event
   * @param event
   */
  onColumnDragStart(event: DragEvent) {
    if (this.resizeHandler.columnResizing) {
      event.preventDefault();
      return;
    }
    this.reorderHandler.onColumnDragStart(event);
  }

  /**
   * Handles column dragover event
   * @param event
   */
  onColumnDragover(event: DragEvent) {
    this.reorderHandler.onColumnDragover(event);
  }

  /**
   * Handles column dragleave event
   * @param event
   */
  onColumnDragleave(event: DragEvent) {
    this.reorderHandler.onColumnDragleave(event);
  }

  /**
   * Handles column drop event
   * @param event
   */
  onColumnDrop(event) {
    this.reorderHandler.onColumnDrop(event, this.columns);
  }

  /**
   * Whether the grid has a footer.
   */
  hasFooter() {
    return this.managerHandler.hasFooter();
  }

  /**
   * Whether the grid has data to render.
   * @returns
   */
  isEmpty() {
    return !this.dataToRender || this.dataToRender.length === 0;
  }

  /**
   * Creates lazy load metadata to emit in a lazy load event.
   */
  createLazyLoadMetadata(): IsGridLazyLoadEvent {
    return {
      first: this.first,
      rows: this.virtualScroll ? this.rows * 2 : this.rows,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      filters: this.filters,
      globalFilter: this.globalFilter  ? this.globalFilter.value : ( (this.paginator) ? this.filterHandler.paginatorFilterValue : null),
      multiSortMeta: this.multiSortMeta
    };
  }

  /**
   * Callback function on paginator search Input and on search input submit events.
   * Search all fields with the paginator keyword
   * @param search
   */
  onSearchInput(search) {
    this.filterHandler.paginatorFilterValue = search.keyword;
    if ( this.globalFilter ) {
      this.globalFilter.value = search.keyword;
    }
    if (this.filterHandler.filterTimeout) {
      clearTimeout(this.filterHandler.filterTimeout);
    }
    this.filterHandler.filterTimeout = setTimeout(() => {
      this._filter(search.matchCase);
      this.filterHandler.filterTimeout = null;
    }, this.filterDelay);
  }

  /**
   * Callback function on paginator refresh event.
   */
  onRefresh(event) {
    this.refresh.emit(event);
  }

  /**
   * Callback function on print refresh event.
   */
  onPrint(event) {
    this.print.emit(event);
  }


  /**
   * Decides whether a row group should be opened / closed.
   * @param row
   * @param [event]
   */
  toggleRow(row: any, event?: Event) {
    this.groupHandler.toggleRow(row, event);
  }

  /**
   * Whether a row is opened or close.
   * @param row
   */
  isRowExpanded(row: any): boolean {
    return this.groupHandler.findExpandedRowIndex(row) !== -1;
  }

  /**
   * Whether a row group is opened or close.
   * @param row
   */
  isRowGroupExpanded(row: any): boolean {
    return this.groupHandler.findExpandedRowGroupIndex(row) !== -1;
  }

  /**
   * Decides whether a row group should be opened / closed.
   * @param event
   * @param row
   */
  toggleRowGroup(event: Event, row: any) {
    return this.groupHandler.toggleRowGroup(event, row);
  }

  /**
   * Calls the managerHandler function to reset table status.
   */
  reset() {
    this.managerHandler.reset();
  }

  /**
   * Calls the csvHandler function to export to CSV.
   */
  exportCSV(options?: any) {
    let data = this.filterHandler.filteredValue || this.value;
    if (this.selectionMode = 'multiple' && this.selection && this.selection.length) {
      data = this.selection;
    }
    this.csvHandler.exportCSV(
      data,
      this.csvSeparator,
      this.exportFilename,
      this.columns
    );
  }

  /**
   * Returns the style class of a row.
   * @param rowData
   * @param rowIndex
   */
  getRowStyleClass(rowData: any, rowIndex: number) {
    let styleClass = 'is-grid__data';
    if (this.rowStyleClass) {
      const rowClass = this.rowStyleClass.call(this, rowData, rowIndex);
      if (rowClass) {
        styleClass += ' ' + rowClass;
      }
    } else if (this.rowStyleMap && this.dataKey) {
      const rowClass = this.rowStyleMap[rowData[this.dataKey]];
      if (rowClass) {
        styleClass += ' ' + rowClass;
      }
    }

    return styleClass;
  }

  /**
   * Returns the visible columns.
   */
  visibleColumns() {
    return this.columns ? this.columns.filter(c => !c.hidden) : [];
  }

  /**
   * Returns the grid container width.
   * @readonly
   */
  get containerWidth() {
    if (this.scrollable) {
      if (this.scrollWidth) {
        return this.scrollWidth;
      } else if (this.frozenWidth && this.unfrozenWidth) {
        return (
          parseFloat(this.frozenWidth) + parseFloat(this.unfrozenWidth) + 'px'
        );
      }
    } else {
      return this.style ? this.style.width : null;
    }
  }

  /**
   * Whether the grid has frozen columns.
   */
  hasFrozenColumns() {
    return this.frozenColumns && this.frozenColumns.length > 0;
  }

  /**
   * Returns the unique values for a field.
   * @param field
   * @returns
   */
  uniqueValues(field: string) {
    const arr = [];
    for (let i = 0; i < this.value.length; i++) {
      if (arr.indexOf(this.value[i][field]) === -1) {
        arr.push(this.value[i][field]);
      }
    }
    return arr;
  }
}
