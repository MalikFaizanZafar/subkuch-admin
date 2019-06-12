import { OverlayModule } from '@angular/cdk/overlay';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IsDatepicker } from './datepicker';
import { IsInputModule } from '../input/index';
import { IsButtonModule } from '../button/index';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    IsInputModule,
    IsButtonModule,
    OverlayModule
  ],
  exports: [
    IsDatepicker
  ],
  declarations: [
    IsDatepicker
  ]
})
export class IsDatepickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsDatepickerModule,
      providers: []
    };
  }
}
