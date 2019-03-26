import { IsGridColumn } from '../shared/column';
import { Renderer2, EventEmitter } from '@angular/core';
import { DomHandler } from '../../core/index';

export class IsGridEditorHandler {

  editable: boolean;

  editingCell: any;

  documentEditListener: Function;

  editorClick: boolean;

  constructor( private editInit: EventEmitter<any> = new EventEmitter<any>(),
               public domHandler: DomHandler,
               public renderer: Renderer2) {}

  onCellEditorKeydown(
    event,
    column: IsGridColumn,
    rowData: any,
    rowIndex: number
  ) {
    if (this.editable) {
      // enter
      if (event.keyCode === 13) {
        if (
          this.domHandler.find(this.editingCell, '.ng-invalid.ng-dirty')
            .length === 0
        ) {
          this.switchCellToViewMode(event.target);
          event.preventDefault();
        }
      } else if (event.keyCode === 27) {
        // escape
        this.switchCellToViewMode(event.target);
        event.preventDefault();
      } else if (event.keyCode === 9) {
        // tab
        if (event.shiftKey) {
          this.moveToPreviousCell(event);
        } else {
          this.moveToNextCell(event);
        }
      }
    }
  }

  bindDocumentEditListener() {
    if (!this.documentEditListener) {
      this.documentEditListener = this.renderer.listen(
        'document',
        'click',
        event => {
          if (!this.editorClick) {
            this.closeCell();
          }
          this.editorClick = false;
        }
      );
    }
  }

  unbindDocumentEditListener() {
    if (this.documentEditListener) {
      this.documentEditListener();
      this.documentEditListener = null;
    }
  }

  switchCellToEditMode(cell: any, column: IsGridColumn, rowData) {
      this.editorClick = true;
      this.bindDocumentEditListener();

      if (cell !== this.editingCell) {
        if (
          this.editingCell &&
          this.domHandler.find(this.editingCell, '.ng-invalid.ng-dirty')
            .length === 0
        ) {
          this.domHandler.removeClass(this.editingCell, 'is-grid-table-body__cell--editing');
        }

        this.editingCell = cell;
        this.editInit.emit({ column: column, data: rowData });
        this.domHandler.addClass(cell, 'is-grid-table-body__cell--editing');
        const focusable = this.domHandler.findSingle(
          cell,
          '.is-grid-table-body__editor input, .is-grid-table-body__editor textarea'
        );
        if (focusable) {
          setTimeout(
            () => this.domHandler.invokeElementMethod(focusable, 'focus'),
            50
          );
        }
      }
  }

  switchCellToViewMode(element: any) {
    this.editingCell = null;
    const cell = this.findCell(element);
    this.domHandler.removeClass(cell, 'is-grid-table-body__cell--editing');
    this.unbindDocumentEditListener();
  }

  closeCell() {
    if (this.editingCell) {
      this.domHandler.removeClass(this.editingCell, 'is-grid-table-body__cell--editing');
      this.editingCell = null;
      this.unbindDocumentEditListener();
    }
  }

  moveToPreviousCell(event: KeyboardEvent) {
    const currentCell = this.findCell(event.target);
    const targetCell = this.findPreviousEditableColumn(currentCell);

    if (targetCell) {
      this.domHandler.invokeElementMethod(targetCell, 'click');
      event.preventDefault();
    }
  }

  moveToNextCell(event: KeyboardEvent) {
    const currentCell = this.findCell(event.target);
    const targetCell = this.findNextEditableColumn(currentCell);

    if (targetCell) {
      this.domHandler.invokeElementMethod(targetCell, 'click');
      event.preventDefault();
    }
  }

  findCell(element) {
    if (element) {
      let cell = element;
      while (cell && cell.tagName !== 'TD') {
        cell = cell.parentElement;
      }

      return cell;
    } else {
      return null;
    }
  }

  findPreviousEditableColumn(cell: Element) {
    let prevCell = cell.previousElementSibling;

    if (!prevCell) {
      const previousRow = cell.parentElement.previousElementSibling;
      if (previousRow) {
        prevCell = previousRow.lastElementChild;
      }
    }

    if (prevCell) {
      if (this.domHandler.hasClass(prevCell, 'is-grid-table-body__cell--editable')) {
        return prevCell;
      } else {
        return this.findPreviousEditableColumn(prevCell);
      }
    } else {
      return null;
    }
  }

  findNextEditableColumn(cell: Element) {
    let nextCell = cell.nextElementSibling;

    if (!nextCell) {
      const nextRow = cell.parentElement.nextElementSibling;
      if (nextRow) {
        nextCell = nextRow.firstElementChild;
      }
    }

    if (nextCell) {
      if (this.domHandler.hasClass(nextCell, 'is-grid-table-body__cell--editable')) {
        return nextCell;
      } else {
        return this.findNextEditableColumn(nextCell);
      }
    } else {
      return null;
    }
  }

}
