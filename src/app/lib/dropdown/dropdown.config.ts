import { InjectionToken } from '@angular/core';
import { IsDropdownOptions } from './dropdown-options';

export let DROPDOWN_CONFIG = new InjectionToken<IsDropdownOptions>('dropdown.config');
