import { ComponentPortal, DomPortalHost } from '@angular/cdk/portal';
import {
  AfterViewInit,
  ApplicationRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  Input,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { IsTableService } from '../table.service';
import { IsResizableColumnDragHandle } from './drag-handle/index';

/**
 * Handles column resizing
 */
@Directive({
  selector: 'th[is-resizable-column]'
})
export class IsResizableColumn implements OnDestroy, AfterViewInit {

  /**
   * Add resizing class while
   * dragging the handle
   */
  @HostBinding('class.is-resizable-table--resizing')
  resizing = false;

  /**
   * Max width of the column
   *
   * @memberof IsResizableColumn
   */
  @Input()
  maxWidth: number;

  /**
   * Min width of the column
   *
   * @memberof IsResizableColumn
   */
  @Input()
  minWidth = 0;

  /**
   * Add is-resizable-column class
   * to resizable column
   */
  @HostBinding('class.is-resizable-column')
  resizable = true;

  /**
   * Instance of handle component
   */
  private handleInstance: IsResizableColumnDragHandle;

  /**
   * Portal used for attaching IsResizableColumnDragHandle
   */
  private handlePortal: ComponentPortal<IsResizableColumnDragHandle>;

  /**
   * Host for portal
   */
  private columnPortalHost: DomPortalHost;

  /**
   * Initial width of the column
   */
  private initWidth: number;

  /**
   * If the feature is currently active
   *
   * @memberof IsResizableColumn
   */
  isSetup = false;

  /**
   * Subject that emits when directive is destroyed
   *
   * @protected
   * @memberof IsResizableColumn
   */
  protected readonly destroy$ = new Subject();

  /**
   * Subject that emits when directive is disabled
   *
   * @protected
   * @memberof IsResizableColumn
   */
  protected readonly teardown$ = new Subject();

  /**
   * Injects element reference, component factory resolver,
   * application reference and injector in component
   * Creates handle portal for drag handle
   * Create a PortalHost with table column as its anchor element
   * @param el
   * @param service
   * @param componentFactoryResolver
   * @param appRef
   * @param injector
   */
  constructor( private el: ElementRef,
               private service: IsTableService,
               private componentFactoryResolver: ComponentFactoryResolver,
               private appRef: ApplicationRef,
               private injector: Injector ) {
    // Create a Portal based on the IsResizableColumnDragHandle
    this.handlePortal = new ComponentPortal(IsResizableColumnDragHandle);

    // Create a PortalHost with table column as its anchor element
    this.columnPortalHost = new DomPortalHost(
      this.el.nativeElement,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
  }

  /**
   * Waits for view to be rendered before setting up the directive
   *
   * @memberof IsResizableColumn
   */
  ngAfterViewInit() {
    this.service.$shouldDisableFeatures
      .pipe(takeUntil(this.destroy$))
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
   * Setups the resizable feature in the column
   *
   * @memberof IsResizableColumn
   */
  setup() {
    // Attach handle to the column head
    this.handleInstance = this.columnPortalHost.attach(
      this.handlePortal
    ).instance;

    // Init listeners
    this.initHandleListeners();

    // If max or min width is provided update column width
    if (this.maxWidth || this.minWidth !== 0) {
      this.resizeColumn(0);
    }
    this.isSetup = true;
  }

  /**
   * Disables and removes the resizable feature from the column
   *
   * @memberof IsResizableColumn
   */
  teardown() {
    this.isSetup = false;
    this.columnPortalHost.detach();
    this.teardown$.next();
  }

  /**
   * Initialize listeners for
   * handle component
   *
   * @memberof IsResizableColumn
   */
  initHandleListeners() {
    // Handle drag start
    this.handleInstance.dragStart
      .pipe(takeUntil(this.teardown$))
      .subscribe(() => {
        this.initWidth = this.el.nativeElement.clientWidth;
        this.resizing = true;
      });

    // Handle drag end
    this.handleInstance.dragEnd
      .pipe(takeUntil(this.teardown$))
      .subscribe(() => {
        this.resizing = false;
      });

    // Handle on drag
    this.handleInstance.drag
      .pipe(takeUntil(this.teardown$))
      .subscribe(res => {
        this.resizeColumn(res);
      });
  }

  /**
   * Resize column
   * Updates width of the column by adding the stretched width
   * If new width is more than given maxWidth, column width is
   * changed to max width
   * If new width is less than given minWidth, column width is
   * changed to min width
   * @param delta
   * @memberof IsResizableColumn
   */
  resizeColumn( delta: number ) {
    let width = this.initWidth + delta;
    width = !this.maxWidth || width < this.maxWidth ? width : this.maxWidth;
    width = width > this.minWidth ? width : this.minWidth;
    this.el.nativeElement.style.width = width + 'px';
    this.el.nativeElement.style.maxWidth = width + 'px';
    this.el.nativeElement.style.minWidth = width + 'px';

    if (delta !== 0) {
      this.service.onResize(this.el);
    }
  }

  /**
   * Unsubscribe listeners &
   * detach handle from column
   *
   * @memberof IsResizableColumn
   */
  ngOnDestroy() {
    this.columnPortalHost.detach();
    this.destroy$.next();
    this.destroy$.complete();
    this.teardown$.next();
    this.teardown$.complete();
  }
}
