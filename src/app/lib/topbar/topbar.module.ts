/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 02/02/2017.
 */
import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IsTopbar } from './topbar';
import { IsTopbarLogo } from './topbar-logo';

@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [
    IsTopbar,
    IsTopbarLogo
  ],
  declarations: [
    IsTopbar,
    IsTopbarLogo
  ],
})
export class IsTopbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsTopbarModule,
      providers: []
    };
  }
}
