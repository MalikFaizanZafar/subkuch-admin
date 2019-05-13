import { IsTableHeader } from './table-header';
import { IS_TABLE_CONFIGURATION } from './table-configuration.token';
import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsTable } from './table';
import { IsTableService } from './table.service';
import { IsColumnFilter } from './column-filter/index';
import { IsDeletableRow } from './deletable-row/index';
import { IsExpandableRow, IsRowDetail, IsExpandableRowAvoider } from './expandable-row/index';
import { IsResizableColumn } from './resizable-column/index';
import { IsResizableColumnDragHandle } from './resizable-column/drag-handle/index';
import { IsReorderableTable, IsReorderableColumn } from './reorderable-table/index';
import { IsSortableColumn } from './sortable-column/index';
import { IsTableRow } from './table-row';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { IsLockableColumn } from './lockable-table/lockable-column';
import { IsLockableTable } from './lockable-table/lockable-table';
import { IsLockableData } from './lockable-table/lockable-data';
import { IsLockableButton } from './lockable-table/lockable-button/lockable-button';
import { LayoutModule } from '@angular/cdk/layout';
import { IsTableConfiguration } from './table-configuration';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    NgbPopoverModule.forRoot()
  ],
  exports: [
    IsTable,
    IsSortableColumn,
    IsColumnFilter,
    IsExpandableRow,
    IsRowDetail,
    IsDeletableRow,
    IsResizableColumn,
    IsResizableColumnDragHandle,
    IsReorderableTable,
    IsReorderableColumn,
    IsTableRow,
    IsExpandableRowAvoider,
    IsLockableColumn,
    IsLockableData,
    IsLockableTable,
    IsTableRow,
    IsLockableButton,
    IsTableHeader
  ],
  declarations: [
    IsTable,
    IsSortableColumn,
    IsColumnFilter,
    IsExpandableRow,
    IsRowDetail,
    IsDeletableRow,
    IsResizableColumn,
    IsResizableColumnDragHandle,
    IsReorderableTable,
    IsReorderableColumn,
    IsTableRow,
    IsExpandableRowAvoider,
    IsLockableColumn,
    IsLockableData,
    IsLockableTable,
    IsTableRow,
    IsLockableButton,
    IsTableHeader
  ],
  providers: [IsTableService],
  entryComponents: [IsResizableColumnDragHandle, IsLockableButton]
})
export class IsTableModule {
  static forRoot(configuration?: IsTableConfiguration): ModuleWithProviders {
    return {
      ngModule: IsTableModule,
      providers: [
        {
          provide: IS_TABLE_CONFIGURATION,
          useValue: configuration,
        }
      ]
    };
  }
}
