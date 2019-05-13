import { Component, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * Class to create column drag handle that
 * defines the increase or decrease in width
 * of column on drag
 */
@Component({
  selector: 'is-resizable-column-drag-handle',
  templateUrl: './drag-handle.html',
  styleUrls: ['./drag-handle.scss']
})
export class IsResizableColumnDragHandle {

  /**
   * Drag event subject
   */
  public drag = new Subject<number>();

  /**
   * Drag start event subject
   */
  public dragStart = new Subject<any>();

  /**
   * Drag end subject
   */
  public dragEnd = new Subject<any>();

  /**
   * Preserve mouse x position
   * on handle click
   */
  private startX: number;

  /**
   * Wheather column is being
   * resized or not
   */
  private dragging = false;

  /**
   * Listen for Mouse Up event
   *
   * @memberof IsResizableColumnDragHandle
   */
  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.dragging) {
      this.dragging = false;
      this.dragEnd.next();
    }
  }

  /**
   * Listen for Mouse Move event
   * @param e
   * @memberof IsResizableColumnDragHandle
   */
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    if (this.dragging) {
      this.drag.next(e.clientX - this.startX);
    }
  }

  /**
   * Listen for Mouse Down event
   * @param e
   * @memberof IsResizableColumnDragHandle
   */
  onMouseDown(e: MouseEvent) {
    e.stopPropagation();
    this.dragging = true;
    this.startX = e.clientX;
    this.dragStart.next();
  }

  /**
   * Stop popagation on handle click
   * @param e
   * @memberof IsResizableColumnDragHandle
   */
  onClick(e: MouseEvent) {
    e.stopPropagation();
  }
}
