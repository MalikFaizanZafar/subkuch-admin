import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { AuthConfig } from "./modules/auth/auth.config";
import { NotificationsService } from "./services/notifications.service";
import { FranchiseAccountService } from "./modules/vendors/services/franchiseAccount.service";
import { AddCategoryDialogComponent } from "./modules/vendors/components/add-category-dialog/add-category-dialog.component";
import { FranchiseItemsService } from "./modules/vendors/services/franchiseItems.service";
import { EditDealDialogBoxComponent } from "./modules/vendors/components/edit-deal-dialog-box/edit-deal-dialog-box.component";
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent, AddCategoryDialogComponent, EditDealDialogBoxComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    SharedModule,
    BrowserAnimationsModule,
    AgmCoreModule.forRoot(environment.googleMapsAPI),
    SocialLoginModule,
    AngularFireModule.initializeApp(environment.firebase),
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
    GoogleMapsAPIWrapper,
    FranchiseItemsService
  ],
  bootstrap: [AppComponent],
  entryComponents: [AddCategoryDialogComponent, EditDealDialogBoxComponent]
})
export class AppModule {}
