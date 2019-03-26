import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AgmCoreModule } from '@agm/core';
import { LocationSelectorComponent } from './modules/vendors/modal/location-selector/location-selector/location-selector.component';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { AuthConfig } from './modules/auth/auth.config';

@NgModule({
  declarations: [AppComponent, LocationSelectorComponent],
  imports: [
    AppRoutingModule,
    BrowserModule, 
    CoreModule, 
    SharedModule, 
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkScOhpOriytM-HCi_8lh6bSIVfMhsJ8E',
      libraries: ["places"]
    }),
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: AuthConfig
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [LocationSelectorComponent]
})
export class AppModule {}
