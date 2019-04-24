import {
  Directive,
  TemplateRef
} from '@angular/core';
import { IsImplicitContext } from '../core';
import { IsSelectNode } from './select-node';

/**
 * Select option template directive
 */
@Directive({
  selector: '[isOptionTemplate]',
  exportAs: 'isOptionTemplate',
})
export class IsOptionTemplate {

  /**
   * Creates an instance of IsOptionTemplate.
   * @param template reference of the template
   */
  constructor(public template: TemplateRef<IsImplicitContext<IsSelectNode>>) {}
}
