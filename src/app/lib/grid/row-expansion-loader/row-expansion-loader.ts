import { Component, EmbeddedViewRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'is-grid-row-expansion-loader',
  template: ``,
})
export class IsGridRowExpansionLoader implements OnInit, OnDestroy {

  /**
   * Template ref for an expandable row
   */
  @Input()
  template: TemplateRef<any>;

  /**
   * Row data of an expandable row
   */
  @Input()
  rowData: any;

  /**
   * Row index of an expandable row
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
   * Creates embedded view ref for an expandable row.
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.template, {
      '\$implicit': this.rowData,
      'rowIndex': this.rowIndex
    });
  }

  /**
   * Lifecycle method called on component destruction
   * Destroy embedded view ref for an expandable row.
   */
  ngOnDestroy() {
    this.view.destroy();
  }
}
