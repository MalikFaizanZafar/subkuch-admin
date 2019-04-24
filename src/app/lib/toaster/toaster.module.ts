import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsToast } from './toast';
import { IsToasterService } from './toast.service';
import { IsToastContainer } from './toast-container';
import { IsBaseToastOptions } from './toast-base-options';
import { TOAST_CONFIG } from './toast-config';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    IsToast,
    IsToastContainer
  ],
  declarations: [
    IsToast,
    IsToastContainer
  ],
  entryComponents: [
    IsToast,
    IsToastContainer
  ]
})
export class IsToasterModule {
  static forRoot(toastDefaultOptions?: IsBaseToastOptions): ModuleWithProviders {
    return {
      ngModule: IsToasterModule,
      providers: [
        IsToasterService,
        {provide: TOAST_CONFIG, useValue: toastDefaultOptions}
      ]
    };
  }
}
