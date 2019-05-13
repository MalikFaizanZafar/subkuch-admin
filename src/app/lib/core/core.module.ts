import { ModuleWithProviders, NgModule } from '@angular/core';

import { IsPrefix } from './shared/directives/prefix';
import { IsSuffix } from './shared/directives/suffix';
import { IsFileSizePipe } from './shared/pipe/file-size.pipe';
import { FilterPipe } from './shared/pipe/filter.pipe';
import { KeysPipe } from './shared/pipe/keys.pipe';
import { IS_ERROR_STATE_MATCHER } from './shared/tokens/error-state-matcher.token';
import { showOnTouchedOrFormSubmittedErrorStateMatcher } from './shared/utils/error-state-matchers';

@NgModule({
  exports: [KeysPipe, FilterPipe, IsFileSizePipe, IsPrefix, IsSuffix],
  declarations: [KeysPipe, FilterPipe, IsFileSizePipe, IsPrefix, IsSuffix]
})
export class IsCoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsCoreModule,
      providers: [
        {
          provide: IS_ERROR_STATE_MATCHER,
          useValue: showOnTouchedOrFormSubmittedErrorStateMatcher
        }
      ]
    };
  }
}

/**
 * Module to import the IsCoreModule as root
 */
export const IS_CORE_MODULE_FOR_ROOT: ModuleWithProviders = IsCoreModule.forRoot();
