import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { SharedModule } from '@app/shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';

@NgModule({
  imports: [
    CommonModule, 
    HomeRoutingModule, 
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkScOhpOriytM-HCi_8lh6bSIVfMhsJ8E',
      libraries: ["places"]
    }),],
  declarations: [HomeComponent, LandingComponent],
})
export class HomeModule {}
