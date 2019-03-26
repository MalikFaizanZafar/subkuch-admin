import { IsGridVirtualScrollEvent } from './virtual-scroll-event';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import { IsGrid } from '../grid';
import { DomHandler } from '../../core/index';
import { IsGridHeaderColumnGroup, IsGridFooterColumnGroup, IsGridColumn } from '../shared/index';

@Component({
  selector: 'is-grid-scrollable-view',
  templateUrl: './scrollable-view.html',
  styleUrls: ['./scrollable-view.scss'],
  host: {class: 'is-grid-scrollable-view'},
})
export class IsGridScrollableView implements AfterViewInit, AfterViewChecked, OnDestroy {

  /**
   * Grid Columns
   */
  @Input()
  columns: IsGridColumn[];

  /**
   * Grid header column group
   */
  @Input()
  headerColumnGroup: IsGridHeaderColumnGroup;

  /**
   * Grid footer column group
   */
  @Input()
  footerColumnGroup: IsGridFooterColumnGroup;

  /**
   * Scroll header element
   */
  @ViewChild('scrollHeader')
  scrollHeaderViewChild: ElementRef;

  /**
   * Scroll header box element
   */
  @ViewChild('scrollHeaderBox')
  scrollHeaderBoxViewChild: ElementRef;

  /**
   * Scroll body element
   */
  @ViewChild('scrollBody')
  scrollBodyViewChild: ElementRef;

  /**
   * Scroll table element
   */
  @ViewChild('scrollTable')
  scrollTableViewChild: ElementRef;

  /**
   * Scroll table wrapper element
   */
  @ViewChild('scrollTableWrapper')
  scrollTableWrapperViewChild: ElementRef;

  /**
   * Scroll footer element
   */
  @ViewChild('scrollFooter')
  scrollFooterViewChild: ElementRef;

  /**
   * Scroll footer box element
   */
  @ViewChild('scrollFooterBox')
  scrollFooterBoxViewChild: ElementRef;

  /**
   * Whether or not the view is frozen
   */
  @Input()
  frozen: boolean;

  /**
   * Width of the scrollable view
   */
  @Input()
  width: string;

  /**
   * Whether the data should be loaded on demand during scroll.
   */
  @Input()
  virtualScroll: boolean;

  /**
   * Event that emits on virtual scrolling
   */
  @Output()
  onVirtualScroll: EventEmitter<IsGridVirtualScrollEvent> = new EventEmitter();

  /**
   * Scroll body's HTML node
   */
  scrollBody: HTMLDivElement;

  /**
   * Scroll header's HTML node
   */
  scrollHeader: HTMLDivElement;

  /**
   * Scroll header box's HTML node
   */
  scrollHeaderBox: HTMLDivElement;

  /**
   * Scroll table's HTML node
   */
  scrollTable: HTMLDivElement;

  /**
   * Scroll table wrapper's HTML node
   */
  scrollTableWrapper: HTMLDivElement;

  /**
   * Scroll footer's HTML node
   */
  scrollFooter: HTMLDivElement;

  /**
   * Scroll footer box's HTML node
   */
  scrollFooterBox: HTMLDivElement;

  /**
   * Body scroll's HTML node
   */
  bodyScrollListener: Function;

  /**
   * Header scroll's HTML node
   */
  headerScrollListener: Function;

  /**
   * callback for scroll body mouse wheel event
   */
  scrollBodyMouseWheelListener: Function;

  /**
   * Callback for scroll event
   */
  scrollFunction: Function;

  /**
   * Body's rows height
   */
  rowHeight: number;

  /**
   * Creates an instance of IsGridScrollableView.
   * @param dt
   * @param domHandler
   * @param el
   * @param renderer
   * @param zone
   */
  constructor(
    public dt: IsGrid,
    public domHandler: DomHandler,
    public el: ElementRef,
    public renderer: Renderer2,
    public zone: NgZone) {
  }

  /**
   * Lifecycle hook for afterviewinit, initializes scrolling
   */
  ngAfterViewInit() {
    this.initScrolling();
  }

  /**
   * Lifecycle hook for afterviewchecked. Updates rowheight.
   */
  ngAfterViewChecked() {
    if (this.virtualScroll && !this.rowHeight) {
      const row = this.domHandler.findSingle(this.scrollTable, 'tr.is-grid__data:not(.is-grid__empty-message)');
      if (row) {
        this.rowHeight = this.domHandler.getOuterHeight(row);
      }
    }

    if (!this.frozen) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.alignScrollBar();
        }, 1);
      });
    }
  }

  /**
   * Configures the scrollable, initializes variables and registers
   * scroll events
   */
  initScrolling() {
    this.scrollHeader = this.scrollHeaderViewChild.nativeElement;
    this.scrollHeaderBox = this.scrollHeaderBoxViewChild.nativeElement;
    this.scrollBody = this.scrollBodyViewChild.nativeElement;
    this.scrollTable = this.scrollTableViewChild.nativeElement;
    this.scrollTable.style.top = '0px';
    this.scrollTableWrapper = this.scrollTableWrapperViewChild.nativeElement;
    this.scrollFooter = this.scrollFooterViewChild ? this.scrollFooterViewChild.nativeElement : null;
    this.scrollFooterBox = this.scrollFooterBoxViewChild ? this.scrollFooterBoxViewChild.nativeElement : null;

    this.setScrollHeight();

    if (!this.frozen) {
      this.zone.runOutsideAngular(() => {
        this.scrollHeader.addEventListener('scroll', this.onHeaderScroll.bind(this));
        this.scrollBody.addEventListener('scroll', this.onBodyScroll.bind(this));
      });
    }

    if (!this.frozen) {
      this.alignScrollBar();
    } else {
      this.scrollBody.style.paddingBottom = this.domHandler.calculateScrollBarWidth() + 'px';

    }
  }

  /**
   * Callback executed on body scrolling
   */
  onBodyScroll() {
    let frozenScrollBody;
    const frozenView = this.el.nativeElement.previousElementSibling;
    if (frozenView) {
      frozenScrollBody = this.domHandler.findSingle(frozenView, '.is-grid-scrollable-view__body');
    }

    this.scrollHeaderBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
    if (this.scrollFooterBox) {
      this.scrollFooterBox.style.marginLeft = -1 * this.scrollBody.scrollLeft + 'px';
    }

    if (frozenScrollBody) {
      frozenScrollBody.scrollTop = this.scrollBody.scrollTop;
    }

    if (this.virtualScroll) {
      const viewport = this.domHandler.getOuterHeight(this.scrollBody);
      const tableHeight = this.domHandler.getOuterHeight(this.scrollTable);
      const pageHeight = this.rowHeight * this.dt.rows;
      const virtualTableHeight = this.domHandler.getOuterHeight(this.scrollTableWrapper);
      const pageCount = (virtualTableHeight / pageHeight) || 1;
      if (((this.scrollBody.scrollTop + viewport) > (parseFloat(this.scrollTable.style.top) + tableHeight)) ||
          (this.scrollBody.scrollTop < parseFloat(this.scrollTable.style.top))) {
        const page = Math.floor((this.scrollBody.scrollTop * pageCount) / (this.scrollBody.scrollHeight)) + 1;
        this.onVirtualScroll.emit({
          page: page,
          callback: () => {
            this.scrollTable.style.top = ((page - 1) * pageHeight) + 'px';
          }
        });
      }
    }
  }

  /**
   * Configures the scroll bar height
   */
  setScrollHeight() {
    if (this.dt.scrollHeight) {
      if (this.dt.scrollHeight.indexOf('%') !== -1) {
        this.scrollBody.style.visibility = 'hidden';

        this.scrollBody.style.height = '100px';     // temporary height to calculate static height
        const containerHeight = this.domHandler.getOuterHeight(this.dt.el.nativeElement.children[0]);
        const relativeHeight = this.domHandler.getOuterHeight(this.dt.el.nativeElement.parentElement)
          * parseInt(this.dt.scrollHeight, 10) / 100;
        const staticHeight = containerHeight - 100;   // total height of headers, footers, paginators
        const scrollBodyHeight = (relativeHeight - staticHeight);

        this.scrollBody.style.height = 'auto';
        this.scrollBody.style.maxHeight = scrollBodyHeight + 'px';
        this.scrollBody.style.visibility = 'visible';
      } else {
        this.scrollBody.style.maxHeight = this.dt.scrollHeight;
      }
    }
  }

  /**
   * Callback to sync the header scroll
   */
  onHeaderScroll(event: Event) {
    this.scrollHeader.scrollLeft = 0;
  }

  /**
   * Whether or not the scrolltable has vertical overflow
   */
  hasVerticalOverflow(): boolean {
    return this.domHandler.getOuterHeight(this.scrollTable) > this.domHandler.getOuterHeight(this.scrollBody);
  }

  /**
   * Adjust the header and footer box according to the scrollbar width
   */
  alignScrollBar() {
    const scrollBarWidth = this.hasVerticalOverflow() ? this.domHandler.calculateScrollBarWidth() : 0;
    this.scrollHeaderBox.style.marginRight = scrollBarWidth + 'px';
    if (this.scrollFooterBox) {
      this.scrollFooterBox.style.marginRight = scrollBarWidth + 'px';
    }
  }

  /**
   * Lifecycle hook called on component destruction
   */
  ngOnDestroy() {
    this.scrollHeader.removeEventListener('scroll', this.onHeaderScroll);
    this.scrollBody.removeEventListener('scroll', this.onBodyScroll);
  }

}
