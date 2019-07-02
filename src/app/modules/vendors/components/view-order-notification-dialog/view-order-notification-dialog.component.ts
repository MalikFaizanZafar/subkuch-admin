import { Component, OnInit } from '@angular/core';
import { FranchiseOrdersService } from '../../services/franchiseOrders.service';
import { IsModalSize, IsActiveModal } from 'app/lib';
import { Router } from '@angular/router';

@Component({
  selector: 'view-order-notification-dialog',
  templateUrl: './view-order-notification-dialog.component.html',
  styleUrls: ['./view-order-notification-dialog.component.scss']
})
export class ViewOrderNotificationDialogComponent implements OnInit {

  notifications = []
  constructor(private isActiveModal : IsActiveModal, private router : Router) {}

  ngOnInit() {
    this.notifications = this.isActiveModal.data
  }

  onNotificationClicked(notification){
    if(notification.type === 'order'){
      this.router.navigate(['vendors','orders'], {queryParams: { orderId: notification.id }})
    }
  }
  onOkHandler(){
    this.isActiveModal.close('ok')
    this.notifications = []
  }

}
