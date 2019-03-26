import { IsGridColumn } from './column';
import {
  Input,
  Component,
  OnInit,
  OnDestroy,
  EmbeddedViewRef,
  ViewContainerRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'is-grid-column-body-template-loader',
  template: ``
})
export class IsGridColumnBodyTemplateLoader implements OnInit, OnChanges, OnDestroy {

  /**
   * Object passed as the payload of the column template
   */
  @Input()
  column: IsGridColumn;

  /**
   * Row data for this specific column
   */
  @Input()
  rowData: any;

  /**
   * Row index for this specific column
   */
  @Input()
  rowIndex: number;

  /**
   * Reference to the EmbeddedViewRef that holds the template's instance
   */
  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) { }

  /**
   * Lifecycle method called on component initialization
   * Creates an instance of the column body template using this component
   * as an anchor
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.bodyTemplate, {
      '\$implicit': this.column,
      'rowData': this.rowData,
      'rowIndex': this.rowIndex
    });
  }

  /**
   * Lifecycle method called on input changes
   * Changes the context of the template's instance, specifically for
   * the 'rowIndex' input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!this.view) {
      return;
    }

    if ('rowIndex' in changes) {
      this.view.context.rowIndex = changes['rowIndex'].currentValue;
    }
  }

  /**
   * Lifecycle method called on component destruction
   * Destroy embedded view ref for the column body template.
   */
  ngOnDestroy() {
    this.view.destroy();
  }
}
