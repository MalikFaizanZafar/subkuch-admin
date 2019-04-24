import { CommonModule } from '@angular/common';
import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { IsResizeModule } from '../core';
import { IsPortal } from './portal';
import { IsPortalContent } from './portal-content.directive';
import { IsPortalService } from './portal.service';
import { PORTAL_CONFIG } from './portal.config';
import { IsPortalOptions } from './portal-options';

@NgModule({
  imports: [
    CommonModule,
    IsResizeModule
  ],
  exports: [
    IsPortal
  ],
  declarations: [
    IsPortal,
    IsPortalContent
  ],
  entryComponents: [
    IsPortal
  ]
})
export class IsPortalModule {
  static forRoot( portalConfig?: Partial<IsPortalOptions> ): ModuleWithProviders {
    return {
      ngModule: IsPortalModule,
      providers: [
        IsPortalService,
        {
          provide: PORTAL_CONFIG,
          useValue: portalConfig
        }
      ]
    };
  }
}

/**
 * Module to import the IsPortalModule as root
 */
export const IS_PORTAL_FOR_ROOT = IsPortalModule.forRoot();
