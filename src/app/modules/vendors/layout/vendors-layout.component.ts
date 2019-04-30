import {
  Component,
  OnInit,
  HostBinding,
  ViewChild,
  TemplateRef,
  ElementRef
} from "@angular/core";
import { Router } from "@angular/router";
import { MemberDetails } from "../models/vendor-members";
import { EditMainService } from "../services/editMain.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsButton, IsModalService, IsModalSize } from "../../../lib";
import { IsToasterService } from "../../../lib/toaster";
import { FranchiseInfoService } from "../services/franchiseInfo.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NotificationsService } from "app/services/notifications.service";
import { EditLogoDialogBoxComponent } from "../components/edit-logo-dialog-box/edit-logo-dialog-box.component";
import { EditBannerDialogBoxComponent } from "../components/edit-banner-dialog-box/edit-banner-dialog-box.component";

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
  editLogoForm: FormGroup;
  editBannerForm: FormGroup;
  ratingArray: string[] = ["1", "2", "3", "4", "5"];
  editLogoImageFile;
  tempEditLogoImage;
  editBannerImageFile;
  tempEditBannerImage;
  autoGenerateLinks = [
    {
      label: "Overview",
      link: "overview/"
    },
    {
      label: "Deals",
      link: "deals/"
    },
    {
      label: "Meals",
      link: "meals/"
    },
    {
      label: "Orders",
      link: "orders/"
    },
    {
      label: "Sales",
      link: "sales/"
    },
    {
      label: "Reviews",
      link: "reviews/"
    }
  ];
  franchiseInfo: any = {};
  downloadURL: Observable<string>;
  logoEditCancelled: boolean = false;
  bannerEditCancelled: boolean = false;
  @ViewChild("logoImage") logoImage: ElementRef;
  @ViewChild("bannerImage") bannerImage: ElementRef;
  @ViewChild("notificationIcon") notificationIcon: ElementRef;
  constructor(
    private router: Router,
    private franchiseInfoService: FranchiseInfoService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private editMainService: EditMainService,
    private storage: AngularFireStorage,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {
    this.notificationService.currentMessage.subscribe(messagePayload => {
      console.log("messagePayload is : ", messagePayload);
      if (messagePayload) {
        this.notificationIcon.nativeElement.style.color = "red";
      }
    });

    this.editBannerForm = new FormGroup({
      editBannerImage: new FormControl(null, [Validators.required])
    });

    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.franchiseInfo = responseData.data;
      this.tempEditLogoImage = this.franchiseInfo.logo;
      this.tempEditBannerImage = this.franchiseInfo.welcomeImage;
    });

    this.editMainService.editEnable.subscribe(val => {
      this.editBtnEnabled = val;
    });
  }

  onBellIconClicked() {
    this.notificationIcon.nativeElement.style.color = "white";
  }
  getFranshiseBanner() {
    return (
      this.franchiseInfo.welcomeImage ||
      `https://via.placeholder.com/1100x200.png?text=upload+your+banner+here`
    );
  }

  logoutHandler() {
    localStorage.clear();
    this.user = {};
    this.router.navigate(["auth"]);
  }



  onEditLogoHandler() {
    this.logoEditCancelled = false
    const editLogoDlg = this.isModal.open(EditLogoDialogBoxComponent, {
      data: {
        logo: this.franchiseInfo.logo,
        brandName: this.franchiseInfo.brandName
      }
    });
    editLogoDlg.onClose.subscribe(res => {
      if (res === "cancel") {
        console.log("Edit logo cancelled");
        this.logoEditCancelled = true
      }else if(!this.logoEditCancelled) {
        console.log("Edit logo Not cancelled");
        this.franchiseInfoService.editFranchiseLogo(res).subscribe(editLogoResponse => {
          this.franchiseInfo.logo = editLogoResponse.data.franchise_logo
        })
      }
    });
  }
  onEditBannerHandler() {
    this.bannerEditCancelled = false
    const editBannerDlg = this.isModal.open(EditBannerDialogBoxComponent, {
      size: IsModalSize.Large,
      data : {
        banner: this.franchiseInfo.welcomeImage,
        brandName: this.franchiseInfo.brandName
      }
    });
    editBannerDlg.onClose.subscribe(res => {
      if (res === "cancel") {
        console.log("Edit Banner cancelled");
        this.bannerEditCancelled = true
      }else if(!this.bannerEditCancelled) {
        console.log("Edit Banner Not cancelled");
        this.franchiseInfoService.editFranchiseBanner(res).subscribe(editLogoResponse => {
          this.franchiseInfo.welcomeImage = editLogoResponse.data.welcome_image
        })
      }
    });
  }
}
