import { Component, OnInit } from '@angular/core';
import { FranchiseOrdersService } from '../../services/franchiseOrders.service';
import { IsModalSize, IsActiveModal } from 'app/lib';

@Component({
  selector: 'view-order-notification-dialog',
  templateUrl: './view-order-notification-dialog.component.html',
  styleUrls: ['./view-order-notification-dialog.component.scss']
})
export class ViewOrderNotificationDialogComponent implements OnInit {

  newOrders = []
  constructor(private franchiseOrdersService : FranchiseOrdersService, private isActiveModal : IsActiveModal) {}

  ngOnInit() {
    this.franchiseOrdersService.getNewOrders().forEach(order => {
      this.newOrders.push(JSON.parse(order))
    })
  }
  onOkHandler(){
    this.newOrders = []
    this.franchiseOrdersService.newOrders = []
    this.isActiveModal.close('ok')
  }

}
