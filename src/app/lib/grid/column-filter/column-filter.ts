import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IsGridColumn } from '../shared/index';


/**
 * Filter popup class
 * Updates filter on checkbox change,
 * clicking on select button and clear button
 * or on change of text input value
 */
@Component({
  selector: 'is-grid-column-filter',
  templateUrl: './column-filter.html',
  styleUrls: ['./column-filter.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IsGridColumnFilter implements OnInit {
  /**
   * Main filter object
   */
  filter: any;

  /**
   * List of properties
   */
  @Input()
  properties: string[] = [];

  /**
   * Property to filter the data by
   */
  @Input()
  filterBy: IsGridColumn;

  /**
   * Property to filter the data by
   */
  @Input()
  inputValue: any;

  /**
   * Property to filter the data by
   */
  @Input()
  values: any;

  /**
   * Event to be emitted on filter change
   */
  @Output()
  onFilterChange = new EventEmitter<any>();

  /**
   * Lifecycle method called on component initialization
   * Initializes filter using table service and property list
   */
  ngOnInit() {
    this.filter = {};
    this.properties.forEach(prop => this.filter[prop] = false );
    if (this.values.length) {
      this.values.forEach(element => {
        if (this.filter.hasOwnProperty(element)) {
          this.filter[element] = true;
        }
      });
    }
    this.filter['_filterInput'] = this.inputValue;
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
  onCheckboxToggle(event, filterInput: HTMLInputElement) {
    setTimeout(() => {
      this.filter[event.target.value] = event.target.checked;
      this.onFilterChange.emit(this.filter);
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
      if (property !== '_filterInput') {
      this.filter[property] = true;
      }
    });
    this.onFilterChange.emit(this.filter);
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
      if (property !== '_filterInput') {
        this.filter[property] = false;
        }
    });
    this.onFilterChange.emit(this.filter);
  }

  /**
   * Updates filter and and emit filter change event.
   * If property text matches any of the property
   * then that property is selected and rest all
   * the properties are cleared
   * @param value
   */
  onInputChange(value) {
    this.filter['_filterInput'] = value;
    if ( value === '') {
      this.clearAll();
    } else {
    Object.keys(this.filter).forEach(property => {
      if (property !== '_filterInput') {
        this.filter[property] = property.toLowerCase().indexOf(value.toLowerCase()) > -1;
      }
    });
    this.onFilterChange.emit(this.filter);
    }
  }


}
