import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { VendorsLayoutComponent } from './layout/vendors-layout.component';
import { DealsComponent } from './pages/deals/deals.component';
import { MealsComponent } from './pages/meals/meals.component';
import { OrdersComponent } from './pages/orders/orders.component';

const routes: Routes = [
  { path: '', component: VendorsLayoutComponent, children: [
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
