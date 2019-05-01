import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsBadge } from './badge';

@NgModule({
  imports: [ CommonModule ],
  exports: [
    IsBadge
  ],
  declarations: [
    IsBadge
  ],
})
export class IsBadgeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsBadgeModule,
      providers: []
    };
  }
}
