import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { IsRadioInput, IsRadioGroup } from './radio-input';
import { IsRadioInputService } from './radio-input.service';
import { IsRadioInputConfig } from './radio-input.base-configuration';
import { RADIO_INPUT_CONFIG } from './radio-input.config';

@NgModule({
  imports: [],
  exports: [
    IsRadioInput,
    IsRadioGroup
  ],
  declarations: [
    IsRadioInput,
    IsRadioGroup
  ],
  providers: [
    IsRadioInputService
  ]
})
export class IsRadioInputModule {
  static forRoot( radioInputConfig?: Partial<IsRadioInputConfig> ): ModuleWithProviders {
    return {
      ngModule: IsRadioInputModule,
      providers: [
        {
          provide: RADIO_INPUT_CONFIG,
          useValue: radioInputConfig
        }
      ]
    };
  }
}
