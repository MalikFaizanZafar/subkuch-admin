import { IsGridColumn } from './column';
import {
  Input,
  Component,
  OnInit,
  OnDestroy,
  EmbeddedViewRef,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'is-grid-column-editor-template-loader',
  template: ``
})
export class IsGridColumnEditorTemplateLoader implements OnInit, OnDestroy {

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
   * Creates an instance of the column editor template using this component
   * as an anchor
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.editorTemplate, {
      '\$implicit': this.column,
      'rowData': this.rowData,
      'rowIndex': this.rowIndex
    });
  }

  /**
   * Lifecycle method called on component destruction
   * Destroy embedded view ref for the column editor template.
   */
  ngOnDestroy() {
    this.view.destroy();
  }
}
