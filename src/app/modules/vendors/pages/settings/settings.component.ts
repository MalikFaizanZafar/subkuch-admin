import { Component, OnInit } from "@angular/core";
import { FranchiseInfoService } from "../../services/franchiseInfo.service";
import { IsModalService } from "app/lib";
import { UserAuthService } from "app/modules/auth/services/auth.service";
import { AddFranchiseDialogComponent } from "../../components/add-franchise-dialog/add-franchise-dialog.component";

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
    private userAuthService: UserAuthService
  ) {}

  ngOnInit() {
    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.brandId = responseData.data.brandId;
      this.serviceId = responseData.data.serviceId;
      this.brandName = responseData.data.brandName
      this.franchiseInfo = responseData.data;
      console.log("this.franchiseInfo is : ", this.franchiseInfo)
      if (this.franchiseInfo.isAdmin === true) {
        this.franchises = this.franchiseInfo.franchises;
      } else {
        this.franchises = [];
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
      console.log("addFranchiseDialog res is : ", res);
      if (res === 0) {
        this.dialogCancelled = true;
      } else if (!this.dialogCancelled) {
        this.userAuthService.signup(res).subscribe(newFranchiseResponse => {
          console.log("newFranchiseResponse is : ", newFranchiseResponse);
        });
      }
    });
  }
}
