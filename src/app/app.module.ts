import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { LocationSelectorComponent } from "./modules/vendors/modal/location-selector/location-selector/location-selector.component";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { AuthConfig } from "./modules/auth/auth.config";
import { NotificationsService } from "./services/notifications.service";
import { FranchiseAccountService } from "./modules/vendors/services/franchiseAccount.service";


@NgModule({
  declarations: [AppComponent, LocationSelectorComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB-EsaismaaJDTBDg0F2l-28Z-7zsVCTWU ",
      libraries: ["places"]
    }),
    SocialLoginModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBVuIpEpE4Ke9xam26eRzVZItTslj6iTMY",
      authDomain: "subquch-d4369.firebaseapp.com",
      databaseURL: "https://subquch-d4369.firebaseio.com",
      projectId: "subquch-d4369",
      storageBucket: "gs://subquch-d4369.appspot.com",
      messagingSenderId: "54989238851"
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: AuthConfig
    },
    NotificationsService,
    FranchiseAccountService,
    GoogleMapsAPIWrapper 
  ],
  bootstrap: [AppComponent],
  entryComponents: [LocationSelectorComponent]
})
export class AppModule {}
