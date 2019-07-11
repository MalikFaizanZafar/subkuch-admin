import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateHome } from './services/can-activate-home.service';
import { SideBarTopBarModule } from './modules/sidebar-topbar/sidebar-topbar.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/modules/auth/auth.module#AuthModule',
  },
  {
    path: 'admin',
    loadChildren: 'app/modules/admin/admin.module#AdminModule',
    canActivate: [CanActivateHome]
  },
  {
    path: 'example',
    loadChildren: 'app/modules/sidebar-topbar/sidebar-topbar.module#SideBarTopBarModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
