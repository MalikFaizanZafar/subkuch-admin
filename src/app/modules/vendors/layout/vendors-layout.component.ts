import { Component, OnInit, HostBinding } from "@angular/core";
import { Router } from "@angular/router";
import { MemberDetails } from "../models/vendor-members";
import { EditMainService } from "../services/editMain.service";
import { IsModalService, IsModalSize } from "../../../lib";
import { IsToasterService, IsToastPosition } from "../../../lib/toaster";
import { NotificationsService } from "app/services/notifications.service";
import { SidebarLinks } from "../models/sidebar-links";
import { ViewOrderNotificationDialogComponent } from "../components/view-order-notification-dialog/view-order-notification-dialog.component";
import { FranchiseOrdersService } from "../services/franchiseOrders.service";

@Component({
  selector: "app-vendors-layout",
  templateUrl: "./vendors-layout.component.html",
  styleUrls: ["./vendors-layout.component.scss"]
})
export class VendorsLayoutComponent implements OnInit {
  @HostBinding() class: string =
    "d-flex flex-column col p-0 overflow-y-auto overflow-x-hidden";
  user: MemberDetails;
  editBtnEnabled: boolean;
  notificationCount: number = 0;
  autoGenerateLinks = SidebarLinks;
  logoEditCancelled: boolean = false;
  bannerEditCancelled: boolean = false;
  constructor(
    private router: Router,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private editMainService: EditMainService,
    private notificationService: NotificationsService,
    private franchiseOrdersService: FranchiseOrdersService,
  ) {}

  ngOnInit() {
    this.editMainService.editEnable.subscribe(val => {
      this.editBtnEnabled = val;
    });

    this.listenNotification();
  }

  listenNotification() {
    this.notificationService.currentMessage.subscribe(messagePayload => {
      if (messagePayload) {
        this.notificationCount++;
        console.log(messagePayload);
        this.toaster.popInfo(" You got new order", {
          position: IsToastPosition.BottomRight
        });
      }
    });
  }

  onBellIconClicked() {
    this.notificationCount = 0;
    const viewNotificationsDialog = this.isModal.open(
      ViewOrderNotificationDialogComponent,
      { size: IsModalSize.Large }
    );
    viewNotificationsDialog.onClose.subscribe(res => {
      if (res === "ok") {
        this.franchiseOrdersService.removeNewOrders();
      }
    });
  }

  logoutHandler() {
    localStorage.clear();
    this.user = {};
    this.router.navigate(["auth"]);
  }
}
