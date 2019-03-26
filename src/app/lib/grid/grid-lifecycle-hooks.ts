import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { IsGridTemplate } from './shared/template';
import { IsGrid } from './grid';

export class IsGridLifecycleHooks {

  keyupSubscription: Subscription;

  constructor(private grid: IsGrid) { }

  /**
   * Emits lazy load metadata method. Called on grid initialization.
   */
  onInit() {
    if (this.grid.lazy) {
      this.grid.lazyLoad.emit(this.grid.createLazyLoadMetadata());
    }
  }

  /**
   * Init columns, columns groups and assign grid templates variables.  Called on grid after content init.
   */
  afterContentInit() {
    this.grid.initColumns();
    this.grid.initColumnGroups();

    this.grid.columnsSubscription = this.grid.cols.changes.subscribe(() => {
      this.grid.initColumns();
      this.grid.changeDetector.markForCheck();
    });

    this.grid.templates.forEach((item: IsGridTemplate) => {
      switch (item.getType()) {
        case 'rowexpansion':
          this.grid.rowExpansionTemplate = item.template;
          break;
        case 'rowgroupheader':
          this.grid.rowGroupHeaderTemplate = item.template;
          break;
        case 'rowgroupfooter':
          this.grid.rowGroupFooterTemplate = item.template;
          break;
        case 'emptymessage':
          this.grid.emptyMessageTemplate = item.template;
          break;
      }
    });
  }

  /**
   * Init resizable columns, reordering columns and virtual scrolling .  Called on grid after view checked.
   */
  afterViewChecked() {
    if (this.grid.columnsChanged && this.grid.el.nativeElement.offsetParent) {
      if (this.grid.resizableColumns) {
        this.grid.initResizableColumns();
      }

      if (this.grid.reorderableColumns) {
        this.grid.reorderHandler.initColumnReordering();
      }

      this.grid.columnsChanged = false;
    }

    if (
      this.grid.totalRecordsChanged &&
      this.grid.virtualScroll &&
      this.grid.virtualScrollableTableWrapper &&
      this.grid.virtualScrollableTableWrapper.offsetParent
    ) {
      const row = this.grid.domHandler.findSingle(
        this.grid.virtualScrollableTableWrapper,
        'tr.is-grid__data'
      );
      const rowHeight = this.grid.domHandler.getOuterHeight(row);
      this.grid.virtualTableHeight = this.grid._totalRecords * rowHeight;
      this.grid.virtualScrollableTableWrapper.style.height =
        this.grid.virtualTableHeight + 'px';
      this.grid.totalRecordsChanged = false;
    }
  }

  /**
   *
   */
  afterViewInit() {
    if (this.grid.globalFilter) {
      this.keyupSubscription = fromEvent(this.grid.globalFilter, 'keyup')
        .pipe(debounceTime(this.grid.filterDelay))
        .subscribe(() => this.grid._filter(false));
    }

    this.grid.virtualScrollableTableWrapper = this.grid.domHandler.findSingle(
      this.grid.el.nativeElement,
      'div.is-grid-scrollable-view__wrapper'
    );
    this.grid.initialized = true;
  }

  /**
   * Detect changes to input data and delegate the responsibility accordingly
   */
  doCheck() {
    if (!this.grid.immutable) {
      const changes = this.grid.differ.diff(this.grid.value);
      if (changes) {
        this.grid.managerHandler.handleDataChange();
      }
    }
  }

  /**
   * Called on grid destruction.
   */
  onDestroy() {
    if (this.grid.globalFilterFunction) {
      this.grid.globalFilterFunction();
    }

    if (this.grid.resizableColumns) {
      this.grid.resizeHandler.unbindColumnResizeEvents();
    }

    this.grid.editorHandler.unbindDocumentEditListener();

    if (this.grid.columnsSubscription) {
      this.grid.columnsSubscription.unsubscribe();
    }

    if (this.keyupSubscription) {
      this.keyupSubscription.unsubscribe();
    }

    this.grid.virtualScrollCallback = null;
  }
}
