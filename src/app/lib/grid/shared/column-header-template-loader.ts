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
  selector: 'is-grid-column-header-template-loader',
  template: ``
})
export class IsGridColumnHeaderTemplateLoader implements OnInit, OnDestroy {

  /**
   * Object passed as the payload of the column template
   */
  @Input()
  column: IsGridColumn;

  /**
   * Reference to the EmbeddedViewRef that holds the template's instance
   */
  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) { }

  /**
   * Lifecycle method called on component initialization
   * Creates an instance of the column header template using this component
   * as an anchor
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.headerTemplate, {
      '\$implicit': this.column
    });
  }

  /**
   * Lifecycle method called on component destruction
   * Destroy embedded view ref for the column header template.
   */
  ngOnDestroy() {
    this.view.destroy();
  }
}
