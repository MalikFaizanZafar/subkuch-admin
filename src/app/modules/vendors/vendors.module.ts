import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { VendorsRoutingModule } from './vendors-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { AuthService } from './services/auth.service';
import { UserDetailsService } from './services/userDetails.service';
import { OverviewComponent } from './pages/overview/overview.component';
import { DealsComponent } from './pages/deals/deals.component';
import { MealsComponent } from './pages/meals/meals.component';
import { VendorsLayoutComponent } from './layout/vendors-layout.component';
import { EditOverviewComponent } from './pages/edit-overview/edit-overview.component';
import { EditMainService } from './services/editMain.service';
import { OrdersComponent } from './pages/orders/orders.component';
import { FranchiseComponent } from './pages/franchise/franchise.component';
import { SalesComponent } from './pages/sales/sales.component';
import { OrdersService } from './services/orders.service';
import { FranchiseInfoService } from './services/franchiseInfo.service';
import { FranchiseDealsService } from './services/franchiseDeals.service';
import { FranchiseItemsService } from './services/franchiseItems.service';
import { FranchiseOrdersService } from './services/franchiseOrders.service';
import { FranchiseSalesService } from './services/franchiseSales.service';
import { NotificationsService } from 'app/services/notifications.service';


@NgModule({
  imports: [
    CommonModule,
    VendorsRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAkScOhpOriytM-HCi_8lh6bSIVfMhsJ8E',
      libraries: ['places']
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
    NotificationsService
  ],
  declarations: [
    OverviewComponent, 
    DealsComponent, 
    MealsComponent, 
    VendorsLayoutComponent, 
    EditOverviewComponent, 
    OrdersComponent, 
    FranchiseComponent, 
    SalesComponent
  ]
})
export class VendorsModule { }
