import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DealsComponent } from './pages/deals/deals.component';
import { MealsComponent } from './pages/meals/meals.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { VendorsComponent } from './pages/vendors/vendors.component'

const routes: Routes = [
  { path: '', component: AdminLayoutComponent, children: [
    { path: '', component: VendorsComponent},
    { path: 'deals', component: DealsComponent},
    { path: 'meals', component: MealsComponent},
    { path: 'orders', component: OrdersComponent}
  ]}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
