import { InjectionToken } from '@angular/core';
import { IsTooltipOptions } from './tooltip.options';

export let TOOLTIP_CONFIG = new InjectionToken<IsTooltipOptions>('tooltip.config');
