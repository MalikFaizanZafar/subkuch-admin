import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { order } from '../../models/vendor-members';
import { Router } from '@angular/router';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: order[] = []
  currentUrl: string;
  constructor(private orderService : OrdersService, private router : Router,) { }

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data
    })
    this.currentUrl =  this.router.url
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
