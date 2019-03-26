import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  { 
    path: 'auth', loadChildren: 'app/modules/auth/auth.module#AuthModule' },
  { 
  path: '', component: HomeComponent, 
  children: [
      { path: '', component: LandingComponent }
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
