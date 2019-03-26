import {
  TemplateRef,
  Input,
  Component,
  OnInit,
  OnDestroy,
  EmbeddedViewRef,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'is-grid-template-loader',
  template: ``
})
export class IsGridTemplateLoader implements OnInit, OnDestroy {

  /**
   * Template to load
   */
  @Input()
  template: TemplateRef<any>;

  /**
   * Data bound to this component
   */
  _data: any;

  /**
   * View that holds the template instance
   */
  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) { }

  /**
   * Lifecycle hook executed on component initialization that
   * renders the template
   */
  ngOnInit() {
    this.render();
  }

  /**
   * Creates the view with the incoming template's instance. Bounds the data
   * to the implicit context of the template.
   */
  render() {
    if (this.view) {
      this.view.destroy();
    }

    if (this.template) {
      this.view = this.viewContainer.createEmbeddedView(this.template, {
        '\$implicit': this.data
      });
    }
  }

  /**
   * Data bound to the template's context
   */
  @Input()
  get data(): any {
    return this._data;
  }

  set data(val: any) {
    this._data = val;
    this.render();
  }

  /**
   * Destroy the view once the component is destroyed
   */
  ngOnDestroy() {
    if (this.view) {
      this.view.destroy();
    }
  }
}
