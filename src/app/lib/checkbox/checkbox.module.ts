import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { IsCheckbox } from './checkbox';

@NgModule({
  imports: [],
  exports: [
    IsCheckbox
  ],
  declarations: [
    IsCheckbox
  ],
})
export class IsCheckboxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsCheckboxModule,
      providers: []
    };
  }
}

/**
 * Module to import the DfCheckboxModule as root
 */
export const IS_CHECKBOX_FOR_ROOT = IsCheckboxModule.forRoot();