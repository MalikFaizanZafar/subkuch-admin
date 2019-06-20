import { Component, OnInit, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { order } from "../../models/vendor-members";
import { Router } from "@angular/router";
import { FranchiseOrdersService } from "../../services/franchiseOrders.service";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import { NotificationsService } from 'app/services/notifications.service';
import { IsModalService, IsModalSize } from '../../../../lib';
import { IsToasterService, IsToastPosition } from '../../../../lib/toaster';
import { DataService } from "@app/shared/services/data.service";
import { EditOrderStatusDialogComponent } from "../../components/edit-order-status-dialog/edit-order-status-dialog.component";
import { CreateOrderComponent } from "../../components/create-order/create-order.component";
import { Order } from "../../models/order";

interface MenuItem {
  id: MenuItemType,
  text: string;
}

enum MenuItemType {
  New = 'New',
  Completed = 'Completed',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Edit = 'Edit'
}

@Component({
  selector: "orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"]
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: order[] = [];
  currentUrl: string;
  message;
  loading: boolean = false;
  selectedItem2: Order;
  menuItems: MenuItem[] = [
    {
      id: MenuItemType.New,
      text: 'New'
    },
    {
      id: MenuItemType.Edit,
      text: 'Edit',
    },
    {
      id: MenuItemType.Completed,
      text: 'Completed',
    },
    {
      id: MenuItemType.Delivered,
      text: 'Delivered',
    },
    {
      id: MenuItemType.Cancelled,
      text: 'Cancelled',
    },
  ];

  /**
   * Subscription to be triggered on destroy cycle of component.
   */
  private destroy: Subject<null> = new Subject();

  constructor(
    private franchiseOrdersService: FranchiseOrdersService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private notificationsService: NotificationsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
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
    this.message = this.notificationsService.currentMessage;
    this.populateOrders();
    this.listenNotification();
  }

  isActionDisabled(order: Order) {
    return order.status === MenuItemType.Delivered || order.status === MenuItemType.Completed;
  }

  isVisibleItem(menuItem: MenuItem, order: Order) {
    if (menuItem.id === MenuItemType.Completed && !order.delivery) {
      return true;
    }
    if (menuItem.id === MenuItemType.Delivered && order.delivery) {
      return true;
    }
    if (menuItem.id === MenuItemType.Cancelled && order.delivery && order.status !== MenuItemType.Delivered) {
      return true;
    }
    if (menuItem.id === MenuItemType.Edit && order.status === MenuItemType.New) {
      return true;
    }
    return false;
  }

  menuAction(menuItem: MenuItem, order: Order) {
    if (menuItem.id === MenuItemType.Edit) {
      this.onChangeStatusHandler(order);
    } else {
      order.status = menuItem.text;
      this.loading = true;
      this.franchiseOrdersService.updateOrderStatus({id: order.id, status: order.status})
        .pipe(finalize(() => this.loading = false))
        .subscribe(res => {})
    }
  }

  getTheme(order: Order) {
     if (MenuItemType.Completed === order.status || MenuItemType.Delivered === order.status) {
      return 'success'
    } else if (MenuItemType.Cancelled === order.status) {
      return 'danger';
    } else {
      return 'primary';
    }
  }

  getActionValue(order: Order) {
    return MenuItemType[order.status];
  }

  populateOrders() {
    this.loading = true;
    this.franchiseOrdersService
      .getOrders(this.dataService.franchiseId)
      .pipe(finalize(() => this.loading = false),
        takeUntil(this.destroy))
      .subscribe(responseData => {
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

  createOrder() {
    this.isModal.open(CreateOrderComponent, {
      size: IsModalSize.Large
    });
  }

  isGridrowExpandHandler(row: any) {
  }

  isGridrowCollapseHandler(data: any) {

  }

  onChangeStatusHandler( order: any){
    const editOrderStatusDlg = this.isModal.open(CreateOrderComponent, {
      data: order,
      backdrop: 'static',
      size: IsModalSize.Large
    });

    editOrderStatusDlg.onClose.subscribe(() => this.populateOrders());
  }
}
