import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { IsSlideToggle } from './slide-toggle';
import { IsGestureConfig } from '../core/index';

@NgModule({
  imports: [CommonModule],
  exports: [IsSlideToggle],
  declarations: [IsSlideToggle],
})
export class IsSlideToggleModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsSlideToggleModule,
      providers: [
        {provide: HAMMER_GESTURE_CONFIG, useClass: IsGestureConfig}
      ]
    };
  }
}
