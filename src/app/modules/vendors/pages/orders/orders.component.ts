import { Component, OnInit } from '@angular/core';
import { order } from '../../models/vendor-members';
import { Router } from '@angular/router';
import { FranchiseOrdersService } from '../../services/franchiseOrders.service';
import { NotificationsService } from 'app/services/notifications.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: order[] = []
  currentUrl: string;
  message;
  constructor(private franchiseOrdersService : FranchiseOrdersService, private router : Router,
    private notificationsService : NotificationsService ) { }

  ngOnInit() {
    this.franchiseOrdersService.getOrders(1).subscribe(responseData => {
      this.orders = responseData.data
      console.log('this.orders is : ', this.orders)
    })
    this.currentUrl =  this.router.url
    this.notificationsService.getPermission()
    this.notificationsService.receiveMessage()
    this.message = this.notificationsService.currentMessage
  }

  isGridrowExpandHandler(data : any) {
    let routeVariable = this.currentUrl.substring(0, this.currentUrl.indexOf('?'))
    if(routeVariable) {
      this.router.navigate([routeVariable], { queryParams : { orderId : data.data.oNum}, queryParamsHandling : 'merge'})
    } else {
      this.router.navigate([this.currentUrl], { queryParams : { orderId : data.data.oNum}, queryParamsHandling : 'merge'})
    }
  }

  isGridrowCollapseHandler(data : any) {
    let routeVariable = this.currentUrl.substring(0, this.currentUrl.indexOf('?'))
    if(routeVariable) {
      this.router.navigate([routeVariable]);
    } else {
      this.router.navigate([this.currentUrl]);
    }
  }
  
}
