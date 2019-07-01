import { Component, OnInit } from '@angular/core';
import { FranchiseOrdersService } from '../../services/franchiseOrders.service';
import { IsModalSize, IsActiveModal } from 'app/lib';

@Component({
  selector: 'view-order-notification-dialog',
  templateUrl: './view-order-notification-dialog.component.html',
  styleUrls: ['./view-order-notification-dialog.component.scss']
})
export class ViewOrderNotificationDialogComponent implements OnInit {

  notifications = []
  constructor(private isActiveModal : IsActiveModal) {}

  ngOnInit() {
    this.notifications = this.isActiveModal.data
  }
  onOkHandler(){
    this.isActiveModal.close('ok')
    this.notifications = []
  }

}
