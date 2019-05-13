import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  AfterContentInit
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { IsReorderableTable } from './reorderable-table';
import { IsTableService } from '../table.service';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core';

/**
 * Directive for IsTable th to make it draggable
 * @export
 */
@Directive({
  selector: 'th[is-reorderable-column]'
})
export class IsReorderableColumn implements AfterContentInit, OnDestroy {

  /**
   * The parent reorderable table
   *
   * @memberof IsReorderableColumn
   */
  parent: IsReorderableTable | undefined;

  /**
   * Mouse down subject
   * @memberof IsReorderableColumn
   */
  public mouseDown: Subject<any> = new Subject<any>();

  /**
   * Mouse up subject
   * @memberof IsReorderableColumn
   */
  public mouseUp: Subject<any> = new Subject<any>();

  /**
   * Imitate column drag
   * with mouse events
   * @memberof IsReorderableColumn
   */
  clickTimeOut: any;

  /**
   * If set false, we will not create drop areas
   * It is also used to set reorderable column class
   * Getter for _isReorderableColumn
   * @readonly
   * @memberof IsReorderableColumn
   */
  @Input('is-reorderable-column')
  @HostBinding('class.is-reorderable-column')
  get isReorderableColumn() {
    return this._isReorderableColumn;
  }

  /**
   * Setter for _isReorderableColumn
   * @param value
   */
  set isReorderableColumn( value: boolean ) {
    this._isReorderableColumn = coerceBooleanProperty(value);
  }

  /**
   * Check if column is reorderable or not
   * @default {true}
   */
  private _isReorderableColumn = true;

  /**
   * Set dragging class while dragging and directive has been setup
   * @memberof IsReorderableColumn
   */
  @HostBinding('class.is-dragging-col')
  get draggingClass() {
    return this.isSetup && this.dragging;
  }

  /**
   * Tracks dragging state
   *
   * @memberof IsReorderableColumn
   */
  dragging = false;

  /**
   * Set dragging class while dragging
   * @memberof IsReorderableColumn
   */
  @HostBinding('class.is-dragging-col--left')
  get draggingLeftClass() {
    return this.isSetup && this.draggingLeft;
  }

  /**
   * Tracks dragging left state
   *
   * @memberof IsReorderableColumn
   */
  draggingLeft = false;

  /**
   * Set dragging class while dragging
   * @memberof IsReorderableColumn
   */
  @HostBinding('class.is-dragging-col--right')
  get draggingRightClass() {
    return this.isSetup && this.draggingRight;
  }

  /**
   * Tracks dragging right state
   *
   * @memberof IsReorderableColumn
   */
  draggingRight = false;

  /**
   * If the directive is setup or not
   *
   * @memberof IsReorderableColumn
   */
  isSetup = false;

  /**
   * Subscription for disable feature observable
   *
   * @memberof IsReorderableColumn
   */
  disableFeaturesSubscription: Subscription | null;

  /**
   * Calculate whether the mouse is moving to left or right of column
   * @param event
   */
  mouseToRectColission( event: MouseEvent ) {
    const domRect = this.el.nativeElement.getBoundingClientRect();

    if (domRect.left < event.clientX &&
      domRect.left + domRect.width > event.clientX &&
      domRect.top < event.clientY &&
      domRect.height + domRect.top > event.clientY) {

      const center = domRect.left + (domRect.width * 0.5);

      if (event.clientX < center) {
        this.draggingLeft = true;
        this.draggingRight = false;
      } else if (event.clientX >= center) {
        this.draggingRight = true;
        this.draggingLeft = false;
      }
    }

  }

  /**
   * On drag start event
   * @memberof IsReorderableColumn
   */
  @HostListener('mouseleave')
  onMouseLeave() {
    this.draggingRight = false;
    this.draggingLeft = false;
  }

  /**
   * On mouse move event
   * @param event
   * @memberof IsReorderableColumn
   */
  @HostListener('mousemove', ['$event'])
  onMouseMove( event: MouseEvent ) {
    if (this.parent && this.parent.dragging) {
      this.mouseToRectColission(event);
    }
  }

  /**
   * On drag start event
   * @param event
   * @memberof IsReorderableColumn
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown( event: MouseEvent ) {

    if (event.which === 1 && // left click
      this.isReorderable()) {
      this.clickTimeOut = setTimeout(() => {
        this.dragging = true;
        this.mouseDown.next();
      }, 200);
    }
  }

  /**
   * Set dragging false on document mouse up
   * @memberof IsReorderableColumn
   */
  @HostListener('mouseup')
  onMouseUp() {
    clearTimeout(this.clickTimeOut);
    if (this.isReorderable() && !this.dragging) {
      let side = '';

      if (this.draggingLeft) {
        side = 'left';
      } else if (this.draggingRight) {
        side = 'right';
      }

      this.draggingLeft = false;
      this.draggingRight = false;

      this.mouseUp.next({
        side: side
      });
    } else {
      this.dragging = false;
    }
  }

  /**
   * Creates an instance of IsReorderableColumn.
   * @param el
   * @param service
   * @memberof IsReorderableColumn
   */
  constructor( public el: ElementRef, private service: IsTableService ) {}

  /**
   * Life cycle methos called after
   * content initialization and
   * initializes all listeners
   */
  ngAfterContentInit() {
    this.disableFeaturesSubscription = this.service.$shouldDisableFeatures.subscribe(
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
   * Enables this directive
   *
   * @memberof IsReorderableColumn
   */
  setup() {
    this.isSetup = true;
  }

  /**
   * Disables this directive
   *
   * @memberof IsReorderableColumn
   */
  teardown() {
    this.isSetup = false;
  }

  /**
   * Whether or not column can be reordered
   */
  isReorderable(): boolean {
    const classList = <string[]> this.el.nativeElement.className.split(' ');
    return this.isReorderableColumn && classList.indexOf('is-lockable-column--locked') === -1;
  }

  /**
   * On component destroy, unsubscribe
   *
   * @memberof IsReorderableColumn
   */
  ngOnDestroy() {
    if (this.disableFeaturesSubscription) {
      this.disableFeaturesSubscription.unsubscribe();
    }
  }
}
