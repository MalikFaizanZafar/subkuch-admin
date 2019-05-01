import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  constructor(
    private franchiseOrdersService: FranchiseOrdersService, 
    private router: Router,
    private notificationsService: NotificationsService,
    private cdRef: ChangeDetectorRef ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.currentUrl =  this.router.url;
    this.notificationsService.receiveMessage();
    this.message = this.notificationsService.currentMessage;
    this.populateOrders();
    this.listenNotification();
  }

  populateOrders() {
    this.franchiseOrdersService.getOrders(Number(localStorage.getItem("franchiseId"))).subscribe(responseData => {
      this.orders = responseData.data;
      this.cdRef.detectChanges();
    });
  }

  listenNotification() {
    this.notificationsService.currentMessage.subscribe(messagePayload => {
      if (messagePayload) {
        this.populateOrders();
      }
    });
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
