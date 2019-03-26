import { IsGridFilterMatchMode } from './../utils/models/filter-match-mode';
import { IsGridA11yScope } from './../utils/models/a11y-scope';
import { IsGridSortEvent } from './../utils/models/sort-event';
import {
  Component,
  TemplateRef,
  Input,
  AfterContentInit,
  EventEmitter,
  QueryList,
  Output,
  ContentChildren,
  ContentChild
} from '@angular/core';

import { IsGridTemplate } from './template';
import { IsGridSelectionMode } from '../utils/index';

@Component({
  selector: 'is-grid-column',
  template: ''
})
export class IsGridColumn implements AfterContentInit {

  /**
   * Property of a row data.
   */
  @Input()
  field: string;

  /**
   * Id of the column
   */
  @Input()
  colId: string;

  /**
   * Property of a row data used for sorting, defaults to field.
   */
  @Input()
  sortField: string;

  /**
   * Property of a row data used for filtering, defaults to field.
   */
  @Input()
  filterField: string;

  /**
   * Header text of a column.
   */
  @Input()
  header: string;

  /**
   * Footer text of a column.
   */
  @Input()
  footer: string;

  /**
   * Defines if a column is sortable.
   */
  @Input()
  sortable: boolean | 'custom' = false;

  /**
   * Defines if a column is editable.
   */
  @Input()
  editable: boolean;

  /**
   * Defines if a column can be filtered.
   */
  @Input()
  filter: boolean;

  /**
   * Defines filterMatchMode; 'startsWith', 'contains',
   * 'endsWidth', 'equals', 'notEquals' and 'in'.
   */
  @Input()
  filterMatchMode: IsGridFilterMatchMode;

  /**
   * Type of the filter input field.
   */
  @Input()
  filterType = 'text';

  /**
   * Whether to exclude from global filtering or not.
   */
  @Input()
  excludeGlobalFilter = false;

  /**
   * Number of rows to span for grouping.
   */
  @Input()
  rowspan: number;

  /**
   * Number of columns to span for grouping.
   */
  @Input()
  colspan: number;

  /**
   * Scope property for screen readers, valid values are
   * 'col', 'row', 'colgroup' and 'rowgroup'.
   */
  @Input()
  scope: IsGridA11yScope;

  /**
   * Inline style of the column, can be override with headerStyle,
   * bodyStyle and footerStyle.
   */
  @Input()
  style: string;

  /**
   * Style class of the column, can be overriden with headerStyleClass,
   * bodyStyleClass and footerStyleClass.
   */
  @Input()
  styleClass: string;

  /**
   * Whether the column is included during data export.
   */
  @Input()
  exportable = true;

  /**
   * Inline header style of the column.
   */
  @Input()
  headerStyle: string;

  /**
   * Header style class of the column.
   */
  @Input()
  headerStyleClass: string;

  /**
   * Inline body style of the column.
   */
  @Input()
  bodyStyle: string;

  /**
   * Body style class of the column.
   */
  @Input()
  bodyStyleClass: string;

  /**
   * Inline footer style of the column.
   */
  @Input()
  footerStyle: string;

  /**
   * Footer style class of the column.
   */
  @Input()
  footerStyleClass: string;

  /**
   * Controls visiblity of the column.
   */
  @Input()
  hidden: boolean;

  /**
   * Displays an icon to toggle row expansion.
   */
  @Input()
  expander: boolean;

  /**
   * Defines column based selection mode, options
   * are "single" and "multiple".
   */
  @Input()
  selectionMode: IsGridSelectionMode;

  /**
   * Defines placeholder of the input fields.
   */
  @Input()
  filterPlaceholder: string;

  /**
   * Specifies the maximum number of characters allowed in
   * the filter element.
   */
  @Input()
  filterMaxlength: number;

  /**
   * Whether the column is fixed in horizontal scrolling or not.
   */
  @Input()
  frozen = false;

  /**
   * Whether the column is resizable when resizableColumns is enabled at DataTable.
   */
  @Input()
  resizable = true;

  /**
   * Event fired on column sorting
   */
  @Output()
  sort: EventEmitter<IsGridSortEvent> = new EventEmitter();

  /**
   * IsGridTemplate instances injected into this component
   * via transclusion
   */
  @ContentChildren(IsGridTemplate)
  templates: QueryList<IsGridTemplate>;

  /**
   * plain ng-template located injected into component via
   * transclusion
   */
  @ContentChild(TemplateRef)
  template: TemplateRef<any>;

  /**
   * Template ref for the column's header
   */
  headerTemplate: TemplateRef<any>;

  /**
   * Template ref for the column's body
   */
  bodyTemplate: TemplateRef<any>;

  /**
   * Template ref for the column's footer
   */
  footerTemplate: TemplateRef<any>;

  /**
   * Template ref for the column's filter
   */
  filterTemplate: TemplateRef<any>;

  /**
   * Template ref for the column's editor
   */
  editorTemplate: TemplateRef<any>;

  /**
   * Lifecycle hook after projected content initialization
   * Detects the IsGridTemplates and assign each one of them
   * to the right class member
   */
  ngAfterContentInit() {
    this.templates.forEach((item) => {
      const template = item.template;
      switch (item.getType()) {
        case 'header':
          this.headerTemplate = template;
          break;

        case 'body':
          this.bodyTemplate = template;
          break;

        case 'footer':
          this.footerTemplate = template;
          break;

        case 'filter':
          this.filterTemplate = template;
          break;

        case 'editor':
          this.editorTemplate = template;
          break;

        default:
          this.bodyTemplate = template;
          break;
      }
    });
  }
}
