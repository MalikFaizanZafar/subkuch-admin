import {
  Directive,
  TemplateRef,
  OnInit,
  OnDestroy,
  Input,
  EmbeddedViewRef,
  ViewContainerRef
} from '@angular/core';

@Directive({
  selector: '[isGridTemplateWrapper]'
})
export class IsGridTemplateWrapper implements OnInit, OnDestroy {

  /**
   * Data bound to the template's context
   */
  @Input()
  item: any;

  /**
   * Index bound to the template's context
   */
  @Input()
  index: number;

  /**
   * Template which will be rendered using this host as anchor
   */
  @Input('isGridTemplateWrapper')
  templateRef: TemplateRef<any>;

  /**
   * View corresponding to the template's instance
   */
  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {}

  /**
   * Renders the template and bind a context
   */
  ngOnInit() {
    this.view = this.viewContainer.createEmbeddedView(this.templateRef, {
      '\$implicit': this.item,
      'index': this.index
    });
  }

  /**
   * Destroys the view
   */
  ngOnDestroy() {
    this.view.destroy();
  }
}
