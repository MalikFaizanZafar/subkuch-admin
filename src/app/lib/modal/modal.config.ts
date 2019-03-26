import { InjectionToken } from '@angular/core';
import { IsModalConfig } from './modal.base-configuration';

export let MODAL_CONFIG = new InjectionToken<IsModalConfig>('modal.config');
