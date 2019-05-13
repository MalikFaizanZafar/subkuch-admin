import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgxDfCustom } from './ngx-custom.module';
import { MapModalModule } from '@app/shared/map-modal/map-modal.module';

const SHARED_MODULES: any[] = [NgSelectModule, FormsModule, RouterModule, ReactiveFormsModule, CommonModule, NgxDfCustom, MapModalModule];
const SHARED_COMPONENTS: any[] = [
];
const SHARED_PIPES: any[] = [];
const SHARED_ENTRY_COMPONENTS: any[] = [];

/**
 * The shared module is used to hold all reusable components across the app's
 * different modules. It imports and exports reusable modules to make them
 * readily available to other feature modules just by importing the shared
 * module, avoiding repetition. Since the shared module is meant to be imported
 * by all feature-modules, it shouldn't provide any service.
 */
@NgModule({
  imports: SHARED_MODULES,
  exports: [...SHARED_MODULES, ...SHARED_COMPONENTS, ...SHARED_PIPES],
  declarations: [
    ...SHARED_COMPONENTS,
    ...SHARED_PIPES,
    /** Add components here if necessary */
  ],
  /** Do not provide services here, do it in core.module */
  entryComponents: [SHARED_ENTRY_COMPONENTS],
})
export class SharedModule {}
