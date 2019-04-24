import {
  TemplateRef,
  Input,
  Component,
  OnInit,
  OnDestroy,
  EmbeddedViewRef,
  ViewContainerRef
} from '@angular/core';

import { IsSelectNode } from './select-node';
import { IsImplicitContext } from '../core';

/**
 * Select option template loader component
 */
@Component({
  selector: 'is-option-template-loader',
  template: ``
})
export class IsOptionTemplateLoader implements OnInit, OnDestroy {

  /**
   * Template to load
   */
  @Input()
  template: TemplateRef<IsImplicitContext<IsSelectNode>>;

  /**
   * Data bound to this component
   */
  _option: IsSelectNode;

  /**
   * Data bound to the template's context
   */
  @Input()
  get option(): IsSelectNode {
    return this._option;
  }

  set option(val: IsSelectNode) {
    this._option = val;
    this.render();
  }

  /**
   * View that holds the template instance
   */
  view: EmbeddedViewRef<IsImplicitContext<IsSelectNode>>;

  /**
   * Creates an instance of IsOptionTemplateLoader.
   * @param viewContainer reference to the view container
   */
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
        '\$implicit': this.option
      });
    }
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
