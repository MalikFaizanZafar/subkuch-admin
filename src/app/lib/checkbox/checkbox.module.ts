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
