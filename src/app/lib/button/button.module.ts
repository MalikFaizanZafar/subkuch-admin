import {
  NgModule,
  ModuleWithProviders,
} from '@angular/core';

import {
  IsButton,
  IsWhiteButtonStyler,
  IsLargeButtonStyler,
  IsSmallButtonStyler,
  IsBlockButtonStyler,
  IsFullButtonStyler,
  IsClearButtonStyler,
  IsBorderButtonStyler
} from './button';

@NgModule({
  imports: [],
  exports: [
    IsButton,
    IsWhiteButtonStyler,
    IsLargeButtonStyler,
    IsSmallButtonStyler,
    IsBlockButtonStyler,
    IsFullButtonStyler,
    IsClearButtonStyler,
    IsBorderButtonStyler
  ],
  declarations: [
    IsButton,
    IsWhiteButtonStyler,
    IsLargeButtonStyler,
    IsSmallButtonStyler,
    IsBlockButtonStyler,
    IsFullButtonStyler,
    IsClearButtonStyler,
    IsBorderButtonStyler
  ],
})
export class IsButtonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsButtonModule,
      providers: []
    };
  }
}
