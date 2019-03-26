import { IsGridTemplateType } from './../utils/models/template-type';
import { Directive, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[isGridTemplate]'
})
export class IsGridTemplate {

  /**
   * Template type
   */
  @Input()
  type: IsGridTemplateType;

  /**
   * Template name
   */
  @Input('isGridTemplate')
  name: IsGridTemplateType;

  constructor(public template: TemplateRef<any>) {}

  /**
   * Template name
   */
  getType(): IsGridTemplateType {
      return this.name;
  }
}
