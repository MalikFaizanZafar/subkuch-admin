/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 06/02/2017.
 */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { IsDropdown } from './dropdown';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { IsDropdownOptions } from './dropdown-options';
import { DROPDOWN_CONFIG } from './dropdown.config';

@NgModule({
  imports: [
    NgbDropdownModule
  ],
  exports: [
    IsDropdown
  ],
  declarations: [
    IsDropdown
  ],
  providers: []
})
export class IsDropdownModule {
  static forRoot(defaultOptions?: IsDropdownOptions): ModuleWithProviders {
    return {
      ngModule: IsDropdownModule,
      providers: [{ provide: DROPDOWN_CONFIG, useValue: defaultOptions }]
    };
  }
}
