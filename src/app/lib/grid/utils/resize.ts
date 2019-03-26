import { ElementRef, NgZone, Renderer2, EventEmitter } from '@angular/core';
import { ObjectUtils, IsGridColumnResizeMode } from '../utils/index';
import { DomHandler } from '../../core/index';

/**
 * Helper class that manages the row resizing feature on the grid
 */
export class IsGridResizeHandler {
  /**
   * Whether the column is being resized
   */
  columnResizing: boolean;

  /**
   * Helper cache to keep record of the last resize x coordinate
   */
  lastResizerHelperX: number;

  /**
   * Temporary html element used to do in-the-fly DOM calculations
   */
  resizerHelper: any;

  /**
   * The actual column element which must be resized
   */
  resizeColumn: any;

  /**
   * Defines how the column should be resized, it can either be
   * 'fit' or 'expand'
   */
  columnResizeMode: IsGridColumnResizeMode = 'fit';

  /**
   * Listener to column resizing
   */
  documentColumnResizeEndListener: Function;

  /**
   * Creates an instance of IsGridResizeHandler.
   */
  constructor( private colResize: EventEmitter<any> = new EventEmitter<any>(),
               public objectUtils: ObjectUtils,
               public domHandler: DomHandler,
               public zone: NgZone,
               public el: ElementRef,
               public renderer: Renderer2) {}

  /**
   * Initialize the behaviour of the column resize feature
   */
  initColumnResize(event: MouseEvent, scrollable: boolean, tbody) {
    this.bindColumnResizeEvents(scrollable, tbody);

    const container = this.el.nativeElement.children[0];
    const containerLeft = this.domHandler.getOffset(container).left;
    this.resizeColumn = (event.target as HTMLElement).parentElement;
    this.columnResizing = true;
    this.lastResizerHelperX =
      event.pageX - containerLeft + container.scrollLeft;
  }

  /**
   * Main column resize listener. It will enlarge or shorten the
   * column width according to the mouse event.
   */
  onColumnResize(event: MouseEvent) {
    const container = this.el.nativeElement.children[0];
    const containerLeft = this.domHandler.getOffset(container).left;
    this.domHandler.addClass(container, 'noselect');
    this.resizerHelper.style.height = container.offsetHeight + 'px';
    this.resizerHelper.style.top = 0 + 'px';
    this.resizerHelper.style.left =
      event.pageX - containerLeft + container.scrollLeft + 'px';

    this.resizerHelper.style.display = 'block';
  }

  /**
   * Listener for the column resize end.
   */
  onColumnResizeEnd(event: MouseEvent, scrollable: boolean, tbody) {
    const delta = this.resizerHelper.offsetLeft - this.lastResizerHelperX;
    const columnWidth = this.resizeColumn.offsetWidth;
    const newColumnWidth = columnWidth + delta;
    const minWidth = this.resizeColumn.style.minWidth || 15;

    if (columnWidth + delta > parseInt(minWidth, 10)) {
      if (this.columnResizeMode === 'fit') {
        const nextColumn = this.resizeColumn.nextElementSibling;
        const nextColumnWidth = nextColumn.offsetWidth - delta;

        if (newColumnWidth > 15 && nextColumnWidth > 15) {
          this.resizeColumn.style.width = newColumnWidth + 'px';
          if (nextColumn) {
            nextColumn.style.width = nextColumnWidth + 'px';
          }

          if (scrollable) {
            const colGroup = this.domHandler.findSingle(
              this.el.nativeElement,
              'colgroup.is-grid-scrollable-colgroup'
            );
            const resizeColumnIndex = this.domHandler.index(this.resizeColumn);
            colGroup.children[resizeColumnIndex].style.width =
              newColumnWidth + 'px';

            if (nextColumn) {
              colGroup.children[resizeColumnIndex + 1].style.width =
                nextColumnWidth + 'px';
            }
          }
        }
      } else if (this.columnResizeMode === 'expand') {
        tbody.parentElement.style.width =
          tbody.parentElement.offsetWidth + delta + 'px';
        this.resizeColumn.style.width = newColumnWidth + 'px';
        const containerWidth = tbody.parentElement.style.width;

        if (scrollable) {
          this.domHandler.findSingle(
            this.el.nativeElement,
            '.is-grid-scrollable-view__header-box'
          ).children[0].style.width = containerWidth;
          const colGroup = this.domHandler.findSingle(
            this.el.nativeElement,
            'colgroup.is-grid-scrollable-colgroup'
          );
          const resizeColumnIndex = this.domHandler.index(this.resizeColumn);
          colGroup.children[resizeColumnIndex].style.width =
            newColumnWidth + 'px';
        } else {
          this.el.nativeElement.children[0].style.width = containerWidth;
        }
      }

      this.colResize.emit({
        element: this.resizeColumn,
        delta: delta
      });
    }

    this.resizerHelper.style.display = 'none';
    this.resizeColumn = null;
    this.domHandler.removeClass(
      this.el.nativeElement.children[0],
      'noselect'
    );
    this.unbindColumnResizeEvents();
  }

  /**
   * Sets up all the mouse listeners outside Angular's zone to improve
   * performance.
   */
  bindColumnResizeEvents(scrollable: boolean, tbody) {
    this.zone.runOutsideAngular(() => {
      window.document.addEventListener(
        'mousemove',
        this.onDocumentMouseMove.bind(this)
      );
    });

    this.documentColumnResizeEndListener = this.renderer.listen(
      'document',
      'mouseup',
      event => {
        if (this.columnResizing) {
          this.columnResizing = false;
          this.onColumnResizeEnd(event, scrollable, tbody);
        }
      }
    );
  }

  /**
   * Listener for document mouse move
   */
  onDocumentMouseMove(event: MouseEvent) {
    if (this.columnResizing) {
      this.onColumnResize(event);
    }
  }

  /**
   * Removes the mouse listeners registered on the document
   */
  unbindColumnResizeEvents() {
    window.document.removeEventListener('mousemove', this.onDocumentMouseMove);

    if (this.documentColumnResizeEndListener) {
      this.documentColumnResizeEndListener();
      this.documentColumnResizeEndListener = null;
    }
  }
}
