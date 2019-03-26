/**
 * Created by egonzalez<edgard.gonzalez@aurea.com> on 02/02/2017.
 */
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IsSidebar } from './sidebar';
import { IsSidebarItem } from './sidebar-item';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    IsSidebar,
    IsSidebarItem
  ],
  declarations: [
    IsSidebar,
    IsSidebarItem
  ]
})
export class IsSidebarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IsSidebarModule,
      providers: []
    };
  }
}
