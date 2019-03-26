import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { SidebarTopbarComponent } from './sidebar-topbar.component';
import { SideBarTopBarRoutingModule } from './sidebar-topbar-routing.module';

@NgModule({
  imports: [
    CommonModule, 
    SharedModule,
    SideBarTopBarRoutingModule,
  ],
  declarations: [
    SidebarTopbarComponent,
  ]
})
export class SideBarTopBarModule {}
