import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { IsGridSharedModule } from './shared/index';

import { IsGrid } from './grid';
import { IsGridColumnHeaders } from './headers/headers';
import { IsGridColumnFooters } from './footers/footers';
import { IsGridScrollableView } from './scrollable-view/scrollable-view';
import { IsGridRowExpansionLoader } from './row-expansion-loader/row-expansion-loader';
import { IsGridTableBody } from './table-body/table-body';
import { IsGridColumnFilter } from './column-filter/column-filter';

import { IsCheckboxModule } from '../checkbox';
import { IsRadioInputModule } from '../radio-input';
import { IsTablePaginatorModule } from '../table-paginator';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IsGridSharedModule,
    IsCheckboxModule,
    IsTablePaginatorModule,
    IsRadioInputModule,
    NgbPopoverModule
  ],
  declarations: [
    IsGrid,
    IsGridColumnHeaders,
    IsGridColumnFooters,
    IsGridScrollableView,
    IsGridRowExpansionLoader,
    IsGridTableBody,
    IsGridColumnFilter
  ],
  exports: [
    IsGrid,
    IsGridSharedModule
  ]
})
export class IsGridModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsGridModule
    };
  }
}
