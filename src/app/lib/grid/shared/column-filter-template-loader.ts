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
  selector: 'is-grid-column-filter-template-loader',
  template: ``,
  styleUrls: ['./column-filter-template.scss'],
  host: {class: 'is-grid-column-filter-template-loader'},
})
export class IsGridColumnFilterTemplateLoader implements OnInit, OnDestroy {

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
   * Creates an instance of the column filter template using this component
   * as an anchor
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.column.filterTemplate, {
      '\$implicit': this.column
    });
  }

  /**
   * Lifecycle method called on component destruction
   * Destroy embedded view ref for the column filter template.
   */
  ngOnDestroy() {
    this.view.destroy();
  }
}
