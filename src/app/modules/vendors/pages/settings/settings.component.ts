import { Component, OnInit } from "@angular/core";
import { FranchiseInfoService } from "../../services/franchiseInfo.service";
import { IsModalService, IsModalRef } from "app/lib";
import { UserAuthService } from "app/modules/auth/services/auth.service";
import { AddFranchiseDialogComponent } from "../../components/add-franchise-dialog/add-franchise-dialog.component";
import { ConfirmationModalComponent } from "../../components/confirmation-modal/confirmation-modal.component";
import { IsToasterService, IsToastPosition } from "../../../../lib/toaster";
import { NotificationsService } from "app/services/notifications.service";

@Component({
  selector: "settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  franchiseInfo: any = {};
  franchises = [];
  brandId: Number;
  serviceId: Number;
  brandName: String;
  dialogCancelled: boolean = false;
  
  constructor(
    private franchiseInfoService: FranchiseInfoService,
    private isModal: IsModalService,
    private userAuthService: UserAuthService,
    private toast: IsToasterService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {
    this.populateFranchises();
  }

  populateFranchises() {
    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.brandId = responseData.data.brandId;
      this.serviceId = responseData.data.serviceId;
      this.brandName = responseData.data.brandName
      this.franchiseInfo = responseData.data;

      if (this.franchiseInfo.isAdmin === true) {
        this.franchises = this.franchiseInfo.franchises;
      } else {
        this.franchises = [];
      }
    });
  }

  onActivateClick(row: any) {
    const modalRef: IsModalRef =  this.isModal.open(ConfirmationModalComponent, {
      data: {
        message: `Are you sure you want ${ row.isActive ? 'Activate': 'Deactivate'} this franchise?`
      }
    });

    modalRef.onClose.subscribe(res => {
      if (res === 'ok') {
        this.franchiseInfoService.updateFranchiseInfo(row.id, row).subscribe(response => {
          this.notificationService.updateFranchise.next(true);
          this.toast.popSuccess('Franchise activated successfull', {
            position: IsToastPosition.BottomRight
          });
        });
      } else  {
        row.isActive = false;
      }
    });
  }

  addFranchiseHandler() {
    this.dialogCancelled = false;
    const addFranchiseDialog = this.isModal.open(AddFranchiseDialogComponent, {
      data: {
        brandId: this.brandId,
        brandName: this.brandName,
        service: this.serviceId
      }
    });

    addFranchiseDialog.onClose.subscribe(res => {
      debugger
      console.log("addFranchiseDialog res is : ", res);
      if (res === 0) {
        this.dialogCancelled = true;
      } else if (!this.dialogCancelled) {
        this.userAuthService.signup(res).subscribe(newFranchiseResponse => {
          this.populateFranchises();
        });
      }
    });
  }
}
