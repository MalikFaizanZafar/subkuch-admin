import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { IsTableService } from '../table.service';

/**
 * Filter popup class
 * Updates filter on checkbox change,
 * clicking on select button and clear button
 * or on change of text input value
 */
@Component({
  selector: 'is-column-filter',
  templateUrl: './column-filter.html',
  styleUrls: ['./column-filter.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IsColumnFilter implements OnInit {

  /**
   * Property to filter the data by
   */
  @Input()
  filterBy: string;

  /**
   * Table ID
   */
  @Input()
  tableId: number;

  /**
   * Event to be emitted on filter change
   */
  @Output()
  onFilterChange = new EventEmitter<any>();

  /**
   * Filter object with boolean filter properties
   * to track if property is filtered or not
   */
  filter: any;

  /**
   * List of properties
   */
  properties: string[] = [];

  /**
   * Constructor method to inject
   * IsTableService and element reference
   * @param isTable
   */
  constructor(private isTable: IsTableService) {
  }

  /**
   * Lifecycle method called on component initialization
   * Initializes filter using table service and property list
   */
  ngOnInit() {
    this.filter = this.isTable.getFilter(this.tableId)[this.filterBy];
    this.properties = Object.keys(this.filter || {});
  }

  /**
   * Updates filter and calls filterTable API
   * from table service with updated filter
   * and emit filter change event on checkbox toggle
   *
   * Property with concerend checkbox is toggled
   * @param event
   * @param filterInput
   */
  public onCheckboxToggle(event, filterInput: HTMLInputElement) {
    setTimeout(() => {
      this.filter[event.target.value] = event.target.checked;
      this.isTable.filterTable(this.tableId);
      this.emitFilterChangeEvent();
      filterInput.value = '';
    }, 1);
  }

  /**
   * Updates filter and calls filterTable API
   * from table service with updated filter
   * and emit filter change event on click of
   * select button
   *
   * All properties are selected
   */
  selectAll() {
    Object.keys(this.filter).forEach(property => {
      this.filter[property] = true;
    });
    this.isTable.filterTable(this.tableId);
    this.emitFilterChangeEvent();
  }

  /**
   * Updates filter and calls filterTable API
   * from table service with updated filter
   * and emit filter change event on click of
   * clear button
   *
   * All properties are cleared
   */
  clearAll() {
    Object.keys(this.filter).forEach(property => {
      this.filter[property] = false;
    });
    this.isTable.filterTable(this.tableId);
    this.emitFilterChangeEvent();
  }

  /**
   * Updates filter and calls filterTable API
   * from table service with updated filter
   * and emit filter change event on click of
   * clear button
   *
   * If property text matches any of the property
   * then that property is selected and rest all
   * the properties are cleared
   * @param value
   */
  onInputChange(value) {
    Object.keys(this.filter).forEach(property => {
      this.filter[property] = property.toLowerCase().indexOf(value.toLowerCase()) > -1;
    });
    this.filter['_filterInput'] = value;
    this.isTable.filterTable(this.tableId);
    this.emitFilterChangeEvent();
  }

  /**
   * Get value of filter text input
   */
  getFilterInput() {
    return this.filter ? this.filter['_filterInput'] || '' : '';
  }

  /**
   * Emits filter change event
   */
  emitFilterChangeEvent() {
    if (this.onFilterChange) {
      this.onFilterChange.emit({
        filter: this.filter,
        tableId: this.tableId,
        filterBy: this.filterBy
      });
    }
  }
}
