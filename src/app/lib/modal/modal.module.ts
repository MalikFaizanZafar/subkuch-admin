import { CommonModule } from '@angular/common';
import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { IsModal } from './modal';
import { IsModalTemplate } from './modal-template.directive';
import { IsModalService } from './modal.service';
import { MODAL_CONFIG } from './modal.config';
import { IsModalConfig } from './modal.base-configuration';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    IsModal
  ],
  declarations: [
    IsModal,
    IsModalTemplate
  ],
  entryComponents: [
    IsModal
  ]
})
export class IsModalModule {
  static forRoot( modalConfig?: Partial<IsModalConfig> ): ModuleWithProviders {
    return {
      ngModule: IsModalModule,
      providers: [
        IsModalService,
        {
          provide: MODAL_CONFIG,
          useValue: modalConfig
        }
      ]
    };
  }
}
