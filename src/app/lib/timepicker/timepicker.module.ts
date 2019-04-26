import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IsTimePicker } from './timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [IsTimePicker],
  declarations: [IsTimePicker]
})
export class IsTimePickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsTimePickerModule,
      providers: []
    };
  }
}
