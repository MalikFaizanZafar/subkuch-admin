import { NgModule } from '@angular/core';
import { KeysPipe } from './shared/pipe/keys.pipe';
import { FilterPipe } from './shared/pipe/filter.pipe';
import { IsFileSizePipe } from './shared/pipe/file-size.pipe';

@NgModule({
  exports: [KeysPipe, FilterPipe, IsFileSizePipe],
  declarations: [KeysPipe, FilterPipe, IsFileSizePipe]
})
export class IsCoreModule {}
