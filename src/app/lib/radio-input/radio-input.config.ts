import { InjectionToken } from '@angular/core';
import { IsRadioInputConfig } from './radio-input.base-configuration';

export let RADIO_INPUT_CONFIG = new InjectionToken<IsRadioInputConfig>('radio-input.config');
