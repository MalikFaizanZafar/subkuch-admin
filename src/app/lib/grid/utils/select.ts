
import { EventEmitter } from '@angular/core';
import { DomHandler } from '../../core/index';
import { ObjectUtils, IsGridSelectionMode } from '../utils/index';

/**
 * Helper class that manages the row select feature on the grid
 */
export class IsGridSelectHandler {

  /**
   * Current row selection
   */
  selection: any;

  /**
   * Whether to prevent key event propagation
   */
  preventSelectionKeysPropagation: boolean;

  /**
   * Defines column based selection mode, options are "single" and "multiple"
   */
  selectionMode: IsGridSelectionMode;

  /**
   * Defines all selection keys
   */
  selectionKeys: any;

  /**
   * Index of the row set as the anchor
   */
  anchorRowIndex: number;

  /**
   * Upper bound of the row group selection
   */
  rangeRowIndex: number;

  /**
   * Identifies a unique row to improve performance when deciding if a row
   * is selected or not
   */
  dataKey: string;

  /**
   * Whether or not the row has been touched
   */
  rowTouched: boolean;

  /**
   * Indicates the mode used to compare the selection
   */
  compareSelectionBy = 'deepEquals';

  /**
   * Whether or not the meta key selection is enabled
   */
  metaKeySelection = true;

  /**
   * Creates an instance of IsGridSelectHandler.
   */
  constructor( private selectionChange: EventEmitter<any> = new EventEmitter<any>(),
               private rowSelect: EventEmitter<any> = new EventEmitter<any>(),
               private rowUnselect: EventEmitter<any> = new EventEmitter<any>(),
               public objectUtils: ObjectUtils,
               public domHandler: DomHandler) {}

  /**
   * Whether or not the selection mode is 'single'
   */
  isSingleSelectionMode() {
    return this.selectionMode === 'single';
  }

  /**
   * Whether or not the selection mode is 'multiple'
   */
  isMultipleSelectionMode() {
    return this.selectionMode === 'multiple';
  }

  /**
   * Selects a range of rows starting from 'rowIndex'
   */
  selectRange(event: MouseEvent, rowIndex: number, dataToRender: any[]) {
    let rangeStart, rangeEnd;

    if (this.anchorRowIndex > rowIndex) {
      rangeStart = rowIndex;
      rangeEnd = this.anchorRowIndex;
    } else if (this.anchorRowIndex < rowIndex) {
      rangeStart = this.anchorRowIndex;
      rangeEnd = rowIndex;
    } else {
      rangeStart = rowIndex;
      rangeEnd = rowIndex;
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      const rangeRowData = dataToRender[i];
      this.selection = [...this.selection, rangeRowData];
      this.selectionChange.emit(this.selection);
      const dataKeyValue: string = this.dataKey
        ? String(this.objectUtils.resolveFieldData(rangeRowData, this.dataKey))
        : null;
      if (dataKeyValue) {
        this.selectionKeys[dataKeyValue] = 1;
      }
      this.rowSelect.emit({
        originalEvent: event,
        data: rangeRowData,
        type: 'row'
      });
    }
  }

  /**
   * Clears all the selections
   */
  clearSelectionRange(event: MouseEvent, dataToRender: any[]) {
    let rangeStart, rangeEnd;

    if (this.rangeRowIndex > this.anchorRowIndex) {
      rangeStart = this.anchorRowIndex;
      rangeEnd = this.rangeRowIndex;
    } else if (this.rangeRowIndex < this.anchorRowIndex) {
      rangeStart = this.rangeRowIndex;
      rangeEnd = this.anchorRowIndex;
    } else {
      rangeStart = this.rangeRowIndex;
      rangeEnd = this.rangeRowIndex;
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      const rangeRowData = dataToRender[i];
      const selectionIndex = this.findIndexInSelection(rangeRowData);
      this.selection = this.selection.filter((val, j) => j !== selectionIndex);
      const dataKeyValue: string = this.dataKey
        ? String(this.objectUtils.resolveFieldData(rangeRowData, this.dataKey))
        : null;
      if (dataKeyValue) {
        delete this.selectionKeys[dataKeyValue];
      }
      this.rowUnselect.emit({
        originalEvent: event,
        data: rangeRowData,
        type: 'row'
      });
    }
  }

  /**
   * Returns the index within the selected range that corresponds
   * with the given rowData
   */
  findIndexInSelection(rowData: any): number {
    let index = -1;
    if (this.selection) {
      for (let i = 0; i < this.selection.length; i++) {
        if (this.equals(rowData, this.selection[i])) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  /**
   * Whether a row with the given rowData is selected
   */
  isSelected(rowData: any) {
    if (rowData && this.selection) {
      if (this.dataKey) {
        return (
          this.selectionKeys[
            this.objectUtils.resolveFieldData(rowData, this.dataKey)
          ] !== undefined
        );
      } else {
        if (this.selection instanceof Array) {
          return this.findIndexInSelection(rowData) > -1;
        } else {
          return this.equals(rowData, this.selection);
        }
      }
    }
    return false;
  }

  /**
   * Listener for the row click event. It will select (highlight) or
   * unselect(clear) out rows.
   */
  handleRowclick(event: MouseEvent, rowData: any, index: number, dataToRender: any[]) {
    if (this.selectionMode) {
      if (
        this.isMultipleSelectionMode() &&
        event.shiftKey &&
        this.anchorRowIndex !== null
      ) {
        this.domHandler.clearSelection();
        if (this.rangeRowIndex !== null) {
          this.clearSelectionRange(event, dataToRender);
        }

        this.rangeRowIndex = index;
        this.selectRange(event, index, dataToRender);
      } else {
        const selected = this.isSelected(rowData);
        const metaSelection = this.rowTouched ? false : this.metaKeySelection;
        const dataKeyValue: string = this.dataKey
          ? String(this.objectUtils.resolveFieldData(rowData, this.dataKey))
          : null;
        this.anchorRowIndex = index;
        this.rangeRowIndex = index;

        if (metaSelection) {
          const metaKey = event.metaKey || event.ctrlKey;

          if (selected && metaKey) {
            if (this.isSingleSelectionMode()) {
              this.selection = null;
              this.selectionKeys = {};
              this.selectionChange.emit(null);
            } else {
              const selectionIndex = this.findIndexInSelection(rowData);
              this.selection = this.selection.filter(
                (val, i) => i !== selectionIndex
              );
              this.selectionChange.emit(this.selection);
              if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
              }
            }

            this.rowUnselect.emit({
              originalEvent: event,
              data: rowData,
              type: 'row'
            });
          } else {
            if (this.isSingleSelectionMode()) {
              this.selection = rowData;
              this.selectionChange.emit(rowData);
              if (dataKeyValue) {
                this.selectionKeys = {};
                this.selectionKeys[dataKeyValue] = 1;
              }
            } else if (this.isMultipleSelectionMode()) {
              if (metaKey) {
                this.selection = this.selection || [];
              } else {
                this.selection = [];
                this.selectionKeys = {};
              }

              this.selection = [...this.selection, rowData];
              this.selectionChange.emit(this.selection);
              if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
              }
            }

            this.rowSelect.emit({
              originalEvent: event,
              data: rowData,
              type: 'row'
            });
          }
        } else {
          if (this.isSingleSelectionMode()) {
            if (selected) {
              this.selection = null;
              this.selectionKeys = {};
              this.selectionChange.emit(this.selection);
              this.rowUnselect.emit({
                originalEvent: event,
                data: rowData,
                type: 'row'
              });
            } else {
              this.selection = rowData;
              this.selectionChange.emit(this.selection);
              this.rowSelect.emit({
                originalEvent: event,
                data: rowData,
                type: 'row'
              });
              if (dataKeyValue) {
                this.selectionKeys = {};
                this.selectionKeys[dataKeyValue] = 1;
              }
            }
          } else {
            if (selected) {
              const selectionIndex = this.findIndexInSelection(rowData);
              this.selection = this.selection.filter(
                (val, i) => i !== selectionIndex
              );
              this.selectionChange.emit(this.selection);
              this.rowUnselect.emit({
                originalEvent: event,
                data: rowData,
                type: 'row'
              });
              if (dataKeyValue) {
                delete this.selectionKeys[dataKeyValue];
              }
            } else {
              this.selection = [...(this.selection || []), rowData];
              this.selectionChange.emit(this.selection);
              this.rowSelect.emit({
                originalEvent: event,
                data: rowData,
                type: 'row'
              });
              if (dataKeyValue) {
                this.selectionKeys[dataKeyValue] = 1;
              }
            }
          }
        }
      }

      this.preventSelectionKeysPropagation = true;
    }
  }

  /**
   * Select a row with radio button input
   */
  selectRowWithRadio(event: Event, rowData: any) {
    if (this.selection !== rowData) {
      this.selection = rowData;
      this.selectionChange.emit(this.selection);
      this.rowSelect.emit({
        originalEvent: event,
        data: rowData,
        type: 'radiobutton'
      });

      if (this.dataKey) {
        this.selectionKeys = {};
        this.selectionKeys[
          String(this.objectUtils.resolveFieldData(rowData, this.dataKey))
        ] = 1;
      }
    } else {
      this.selection = null;
      this.selectionChange.emit(this.selection);
      this.rowUnselect.emit({
        originalEvent: event,
        data: rowData,
        type: 'radiobutton'
      });
    }

    this.preventSelectionKeysPropagation = true;
  }

  /**
   * Toggles the row selection according to the state of its
   * associated checkbox input
   */
  toggleRowWithCheckbox(event: Event, rowData: any) {
    const selectionIndex = this.findIndexInSelection(rowData);
    this.selection = this.selection || [];
    const dataKeyValue: string = this.dataKey
      ? String(this.objectUtils.resolveFieldData(rowData, this.dataKey))
      : null;

    if (selectionIndex !== -1) {
      this.selection = this.selection.filter((val, i) => i !== selectionIndex);
      this.selectionChange.emit(this.selection);
      this.rowUnselect.emit({
        originalEvent: event,
        data: rowData,
        type: 'checkbox'
      });
      if (dataKeyValue) {
        delete this.selectionKeys[dataKeyValue];
      }
    } else {
      this.selection = [...this.selection, rowData];
      this.selectionChange.emit(this.selection);
      this.rowSelect.emit({
        originalEvent: event,
        data: rowData,
        type: 'checkbox'
      });
      if (dataKeyValue) {
        this.selectionKeys[dataKeyValue] = 1;
      }
    }

    this.preventSelectionKeysPropagation = true;
  }

  /**
   * Whether two data sets are equivalent
   */
  equals(data1: any, data2: any) {
    return this.compareSelectionBy === 'equals'
      ? data1 === data2
      : this.objectUtils.equals(data1, data2, this.dataKey);
  }
}
