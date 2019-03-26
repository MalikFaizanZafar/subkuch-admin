import { NgZone, ElementRef, EventEmitter } from '@angular/core';
import { DomHandler } from '../../core/index';
import { ObjectUtils } from '../utils/object-utils';
export class IsGridReorderHandler {
  public draggedColumn: any;

  public dropPosition: number;

  public reorderIndicatorUp: any;

  public reorderIndicatorDown: any;

  reorderableColumns: boolean;

  public iconWidth: number;

  public iconHeight: number;

  constructor( private colReorder: EventEmitter<any> = new EventEmitter<any>(),
               public objectUtils: ObjectUtils,
               public domHandler: DomHandler,
               public zone: NgZone,
               public el: ElementRef) {}
  onColumnDragStart(event: DragEvent) {
    this.draggedColumn = this.findParentHeader(event.target);
    event.dataTransfer.setData('text', 'b'); // Firefox requires this to make dragging possible
    this.zone.runOutsideAngular(() => {
      window.document.addEventListener(
        'dragover',
        this.onColumnDragover.bind(this)
      );
    });
  }

  onColumnDragover(event: DragEvent) {
    const dropHeader = this.findParentHeader(event.target);
    if (this.reorderableColumns && this.draggedColumn && dropHeader) {
      event.preventDefault();
      const container = this.el.nativeElement.children[0];
      const containerOffset = this.domHandler.getOffset(container);
      const dropHeaderOffset = this.domHandler.getOffset(dropHeader);

      if (this.draggedColumn !== dropHeader) {
        const targetLeft = dropHeaderOffset.left - containerOffset.left;
        const columnCenter = dropHeaderOffset.left + dropHeader.offsetWidth / 2;

        this.reorderIndicatorUp.style.top =
          dropHeaderOffset.top -
          containerOffset.top -
          (this.iconHeight - 1) +
          'px';
        this.reorderIndicatorDown.style.top =
          dropHeaderOffset.top -
          containerOffset.top +
          dropHeader.offsetHeight +
          'px';

        if (event.pageX > columnCenter) {
          this.reorderIndicatorUp.style.left =
            targetLeft +
            dropHeader.offsetWidth -
            Math.ceil(this.iconWidth / 2) +
            'px';
          this.reorderIndicatorDown.style.left =
            targetLeft +
            dropHeader.offsetWidth -
            Math.ceil(this.iconWidth / 2) +
            'px';
          this.dropPosition = 1;
        } else {
          this.reorderIndicatorUp.style.left =
            targetLeft - Math.ceil(this.iconWidth / 2) + 'px';
          this.reorderIndicatorDown.style.left =
            targetLeft - Math.ceil(this.iconWidth / 2) + 'px';
          this.dropPosition = -1;
        }

        this.reorderIndicatorUp.style.display = 'block';
        this.reorderIndicatorDown.style.display = 'block';
      } else {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }

  onColumnDragleave(event: DragEvent) {
    if (this.reorderableColumns && this.draggedColumn) {
      event.preventDefault();
      this.reorderIndicatorUp.style.display = 'none';
      this.reorderIndicatorDown.style.display = 'none';
      window.document.removeEventListener('dragover', this.onColumnDragover);
    }
  }

  onColumnDrop(event: DragEvent, columns) {
    event.preventDefault();
    if (this.draggedColumn) {
      const dragIndex = this.domHandler.index(this.draggedColumn);
      const dropIndex = this.domHandler.index(
        this.findParentHeader(event.target)
      );
      let allowDrop = dragIndex !== dropIndex;
      if (
        allowDrop &&
        ((dropIndex - dragIndex === 1 && this.dropPosition === -1) ||
          (dragIndex - dropIndex === 1 && this.dropPosition === 1))
      ) {
        allowDrop = false;
      }

      if (allowDrop) {
        this.objectUtils.reorderArray(columns, dragIndex, dropIndex);
        // if (this.scrollable) {
        //  this.initScrollableColumns();
      //  }

        this.colReorder.emit({
          dragIndex: dragIndex,
          dropIndex: dropIndex,
          columns: columns
        });
      }

      this.reorderIndicatorUp.style.display = 'none';
      this.reorderIndicatorDown.style.display = 'none';
      this.draggedColumn.draggable = false;
      this.draggedColumn = null;
      this.dropPosition = null;
    }
  }


  findParentHeader(element) {
    if (element.nodeName === 'TH') {
      return element;
    } else {
      let parent = element.parentElement;
      while (parent.nodeName !== 'TH') {
        parent = parent.parentElement;
        if (!parent) {
          break;
        }
      }
      return parent;
    }
  }
  initColumnReordering() {
  this.reorderIndicatorUp = this.domHandler.findSingle(
    this.el.nativeElement.children[0],
    'span.is-grid__reorder-indicator-up'
  );
  this.reorderIndicatorDown = this.domHandler.findSingle(
    this.el.nativeElement.children[0],
    'span.is-grid__reorder-indicator-down'
  );
  this.iconWidth = this.domHandler.getHiddenElementOuterWidth(
    this.reorderIndicatorUp
  );
  this.iconHeight = this.domHandler.getHiddenElementOuterHeight(
    this.reorderIndicatorUp
  );
  }
}
