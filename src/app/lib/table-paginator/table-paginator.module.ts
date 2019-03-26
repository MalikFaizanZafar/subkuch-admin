import { ModuleWithProviders, NgModule } from '@angular/core';
import { IsTablePaginator } from './table-paginator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IsCheckboxModule } from '../checkbox/checkbox.module';
import { IsInputModule } from '../input/';
import { IsTablePaginatorOptions } from './table-paginator-options';
import { TABLEPAGINATOR_CONFIG } from './table-paginator.config';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    IsCheckboxModule,
    IsInputModule
  ],
  exports: [
    IsTablePaginator
  ],
  declarations: [
    IsTablePaginator
  ]
})
export class IsTablePaginatorModule {
  static forRoot(defaultOptions?: IsTablePaginatorOptions): ModuleWithProviders {
    return {
      ngModule: IsTablePaginatorModule,
      providers: [{ provide: TABLEPAGINATOR_CONFIG, useValue: defaultOptions }]
    };
  }
}
