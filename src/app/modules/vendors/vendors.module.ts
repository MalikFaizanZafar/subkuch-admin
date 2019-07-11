import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { VendorsRoutingModule } from './vendors-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { AuthService } from './services/auth.service';
import { UserDetailsService } from './services/userDetails.service';
import { DealsComponent } from './pages/deals/deals.component';
import { MealsComponent } from './pages/meals/meals.component';
import { VendorsLayoutComponent } from './layout/vendors-layout.component';
import { EditOverviewComponent } from './pages/edit-overview/edit-overview.component';
import { EditMainService } from './services/editMain.service';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrdersService } from './services/orders.service';
import { FranchiseInfoService } from './services/franchiseInfo.service';
import { FranchiseDealsService } from './services/franchiseDeals.service';
import { FranchiseItemsService } from './services/franchiseItems.service';
import { FranchiseOrdersService } from './services/franchiseOrders.service';
import { FranchiseSalesService } from './services/franchiseSales.service';
import { SearchService } from './services/search.service';
import { GoogleMapService } from '@app/shared/services/google-map.service';
import { environment } from 'environments/environment';
import { UserAuthService } from '../auth/services/auth.service';
import { AddDealDialogBoxComponent } from './components/add-deal-dialog-box/add-deal-dialog-box.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';


@NgModule({
  imports: [
    CommonModule,
    VendorsRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyB-EsaismaaJDTBDg0F2l-28Z-7zsVCTWU ",
      libraries: ["places"]
    })
  ],
  providers: [
    AuthService,
    UserDetailsService,
    EditMainService,
    OrdersService,
    FranchiseInfoService,
    FranchiseDealsService,
    FranchiseItemsService,
    FranchiseOrdersService,
    FranchiseSalesService,
    GoogleMapService,
    SearchService,
    UserAuthService
  ],
  declarations: [
    DealsComponent, 
    MealsComponent, 
    VendorsLayoutComponent, 
    EditOverviewComponent, 
    OrdersComponent
  ],
})
export class VendorsModule { }
