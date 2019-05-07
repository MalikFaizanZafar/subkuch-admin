import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { order } from '../../models/vendor-members';
import { Router } from '@angular/router';
import { FranchiseOrdersService } from '../../services/franchiseOrders.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: order[] = [];
  currentUrl: string;
  message;

  /**
   * Subscription to be triggered on destroy cycle of component.
   */
  private destroy: Subject<null> = new Subject();

  constructor(
    private franchiseOrdersService: FranchiseOrdersService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.init();
  }

  /**
   * Destroy life cycle of the component.
   */
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  init() {
    this.currentUrl = this.router.url;
    // this.message = this.notificationsService.currentMessage;
    this.populateOrders();
    // this.listenNotification();
  }

  populateOrders() {
    this.franchiseOrdersService
      .getOrders(this.dataService.franchiseId)
      .subscribe(responseData => {
        this.orders = responseData.data;
        console.log('this.orders is : ', this.orders)
        this.cdRef.detectChanges();
      });
  }

  // listenNotification() {
  //   this.notificationsService.currentMessage.subscribe(messagePayload => {
  //     if (messagePayload) {
  //       this.populateOrders();
  //     }
  //   });
  // }

  isGridrowExpandHandler(data: any) {
    let routeVariable = this.currentUrl.substring(
      0,
      this.currentUrl.indexOf('?')
    );
    if (routeVariable) {
      this.router.navigate([routeVariable], {
        queryParams: { orderId: data.data.oNum },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate([this.currentUrl], {
        queryParams: { orderId: data.data.oNum },
        queryParamsHandling: 'merge'
      });
    }
  }

  isGridrowCollapseHandler(data: any) {
    let routeVariable = this.currentUrl.substring(
      0,
      this.currentUrl.indexOf('?')
    );
    if (routeVariable) {
      this.router.navigate([routeVariable]);
    } else {
      this.router.navigate([this.currentUrl]);
    }
  }
}
