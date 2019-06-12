import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { VendorsLayoutComponent } from './layout/vendors-layout.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { DealsComponent } from './pages/deals/deals.component';
import { MealsComponent } from './pages/meals/meals.component';
import { FranchiseComponent } from './pages/franchise/franchise.component';
import { SalesComponent } from './pages/sales/sales.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { CreateOrderComponent } from './components/create-order/create-order.component';

const routes: Routes = [
  { path: '', component: VendorsLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'overview'},
    { path: 'overview', component: OverviewComponent},
    { path: 'deals', component: DealsComponent},
    { path: 'meals', component: MealsComponent},
    { path: 'orders', component: OrdersComponent},
    { path: 'franchise', component: FranchiseComponent},
    { path: 'sales', component: SalesComponent},
    { path: 'reviews', component: ReviewsComponent},
    { path: 'settings', component: SettingsComponent}
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
