import { InjectionToken } from '@angular/core';
import { IsTablePaginatorOptions } from './table-paginator-options';

export let TABLEPAGINATOR_CONFIG = new InjectionToken<IsTablePaginatorOptions>('table-paginator.config');
