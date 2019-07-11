import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule, StorageBucket } from "@angular/fire/storage";
import { AgmCoreModule, GoogleMapsAPIWrapper } from "@agm/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { AuthConfig } from "./modules/auth/auth.config";
import { FranchiseAccountService } from "./modules/admin/services/franchiseAccount.service";
import { AddCategoryDialogComponent } from "./modules/admin/components/add-category-dialog/add-category-dialog.component";
import { FranchiseItemsService } from "./modules/admin/services/franchiseItems.service";
import { EditDealDialogBoxComponent } from "./modules/admin/components/edit-deal-dialog-box/edit-deal-dialog-box.component";
import { environment } from "../environments/environment";
import { NotificationsService } from "./services/notifications.service";
import { ViewOrderNotificationDialogComponent } from "./modules/admin/components/view-order-notification-dialog/view-order-notification-dialog.component";
import { AddDealDialogBoxComponent } from "./modules/admin/components/add-deal-dialog-box/add-deal-dialog-box.component";
import { AddMealDialogBoxComponent } from "./modules/admin/components/add-meal-dialog-box/add-meal-dialog-box.component";
import { EditMealDialogBoxComponent } from "./modules/admin/components/edit-meal-dialog-box/edit-meal-dialog-box.component";
import { UserAuthService } from "./modules/auth/services/auth.service";
import { EditLogoDialogBoxComponent } from "./modules/admin/components/edit-logo-dialog-box/edit-logo-dialog-box.component";
import { EditBannerDialogBoxComponent } from "./modules/admin/components/edit-banner-dialog-box/edit-banner-dialog-box.component";
import { FranchiseOrdersService } from "./modules/admin/services/franchiseOrders.service";
import { NgbDropdown, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationModalComponent } from "./modules/admin/components/confirmation-modal/confirmation-modal.component";
import { EditOrderStatusDialogComponent } from "./modules/admin/components/edit-order-status-dialog/edit-order-status-dialog.component";
import { CreateOrderComponent } from "./modules/admin/components/create-order/create-order.component";
import { FranchiseDealsService } from "./modules/admin/services/franchiseDeals.service";
import { DataService } from "./shared/services/data.service";

@NgModule({
  declarations: [
    AppComponent,
    EditLogoDialogBoxComponent,
    EditBannerDialogBoxComponent,
    AddCategoryDialogComponent,
    EditDealDialogBoxComponent,
    ViewOrderNotificationDialogComponent,
    AddDealDialogBoxComponent,
    AddMealDialogBoxComponent,
    EditMealDialogBoxComponent,
    ConfirmationModalComponent,
    EditOrderStatusDialogComponent,
    CreateOrderComponent
  ],
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
    AngularFireStorageModule,
    NgbDropdownModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: AuthConfig
    },
    FranchiseAccountService,
    GoogleMapsAPIWrapper,
    FranchiseItemsService,
    FranchiseOrdersService,
    NotificationsService,
    UserAuthService,
    FranchiseDealsService,
    FranchiseItemsService,
    DataService,
    FranchiseOrdersService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditLogoDialogBoxComponent,
    EditBannerDialogBoxComponent,
    AddCategoryDialogComponent,
    EditDealDialogBoxComponent,
    ViewOrderNotificationDialogComponent,
    AddDealDialogBoxComponent,
    AddMealDialogBoxComponent,
    EditMealDialogBoxComponent,
    ConfirmationModalComponent,
    EditOrderStatusDialogComponent,
    CreateOrderComponent
  ]
})
export class AppModule {}
