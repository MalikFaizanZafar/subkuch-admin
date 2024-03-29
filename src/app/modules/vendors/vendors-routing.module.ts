import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { VendorsLayoutComponent } from './layout/vendors-layout.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { DealsComponent } from './pages/deals/deals.component';
import { MealsComponent } from './pages/meals/meals.component';
import { FranchiseComponent } from './pages/franchise/franchise.component';
import { SalesComponent } from './pages/sales/sales.component';
import { OrdersComponent } from './pages/orders/orders.component';

const routes: Routes = [
  { path: ':vendorId', component: VendorsLayoutComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'overview'},
    { path: 'overview', component: OverviewComponent},
    { path: 'deals', component: DealsComponent},
    { path: 'meals', component: MealsComponent},
    { path: 'orders', component: OrdersComponent},
    { path: 'franchise', component: FranchiseComponent},
    { path: 'sales', component: SalesComponent}
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
