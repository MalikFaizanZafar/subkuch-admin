import {
  FullscreenOverlayContainer,
  OverlayContainer,
  OverlayModule
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IS_CHECKBOX_FOR_ROOT, IsCheckboxModule } from '../checkbox';
import {
  IS_CORE_MODULE_FOR_ROOT,
  IsMouseUpService,
  IsResizeModule
} from '../core';
import { IS_PORTAL_FOR_ROOT, IsPortalModule } from '../portal';
import { IsOptionTemplate } from './option-template';
import { IsOptionTemplateLoader } from './option-template-loader';
import { IsOption, IsSelect } from './select';

/**
 * Modules to be exported with Select module
 */
const MODULES: any[] = [
  CommonModule,
  FormsModule,
  OverlayModule,
  IsPortalModule,
  IsCheckboxModule
];

/**
 * Declarations to be exported with Select module
 */
const DECLARATIONS: any[] = [
  IsSelect,
  IsOption,
  IsOptionTemplate,
  IsOptionTemplateLoader
];

@NgModule({
  imports: MODULES,
  exports: [
    ...MODULES,
    ...DECLARATIONS
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer}
  ],
  declarations: DECLARATIONS
})
export class IsSelectBaseModule {}

@NgModule({
  imports: [
    IsSelectBaseModule,
    IS_CORE_MODULE_FOR_ROOT,
    IS_CHECKBOX_FOR_ROOT,
    IS_PORTAL_FOR_ROOT,
    IsResizeModule
  ],
  exports: [ IsSelectBaseModule ]
})
export class IsSelectRootModule {}

@NgModule({
  imports: [ IsSelectBaseModule ],
  exports: [ IsSelectBaseModule ],
})
export class IsSelectModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsSelectRootModule,
      providers: [
        IsMouseUpService
      ]
    };
  }
}

/**
 * Module to import the IsSelectModule as root
 */
export const DF_SELECT_FOR_ROOT: ModuleWithProviders = IsSelectModule.forRoot();
