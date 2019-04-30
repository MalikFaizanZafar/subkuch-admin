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
import { IsButton, IsModalService } from "../../../lib";
import { IsToasterService } from "../../../lib/toaster";
import { FranchiseInfoService } from "../services/franchiseInfo.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { NotificationsService } from "app/services/notifications.service";
import { EditLogoDialogBoxComponent } from "../components/edit-logo-dialog-box/edit-logo-dialog-box.component";

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
    this.editLogoForm = new FormGroup({
      editLogoImage: new FormControl(null, [Validators.required])
    });

    this.editBannerForm = new FormGroup({
      editBannerImage: new FormControl(null, [Validators.required])
    });

    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.franchiseInfo = responseData.data;
      console.log("this.franchiseInfo.logo is : ", this.franchiseInfo.logo);
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

  onEditLogoChooseImage() {
    this.logoImage.nativeElement.click();
  }

  onEditBannerChooseImage() {
    this.bannerImage.nativeElement.click();
  }

  onEditLogoFileChoosen(LogoImageFile: any) {
    const self = this;
    this.editLogoImageFile = LogoImageFile.target.files[0];
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.tempEditLogoImage = dataURL;
    };
    reader.readAsDataURL(LogoImageFile.target.files[0]);
    // this.franchiseInfo.logo = this.editLogoImageFile
  }
  onEditBannerFileChoosen(BannerImageFile: any) {
    const self = this;
    this.editBannerImageFile = BannerImageFile.target.files[0];
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.tempEditBannerImage = dataURL;
    };
    reader.readAsDataURL(BannerImageFile.target.files[0]);
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
  onEditBannerHandler(editBannerDialog: TemplateRef<any>) {
    const editBannerDlg = this.isModal.open(editBannerDialog);
    editBannerDlg.onClose.subscribe(res => {
      if (res === "ok") {
        console.log("Edit Dialog Ok");
      }
    });
  }
  onEditLogoSubmit() {
    if (this.editLogoForm.valid) {
      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const filePath =
        "logos/" + randomString + "-" + this.editLogoImageFile.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.editLogoImageFile);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              let newEditPostDto = {
                image: url,
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              this.franchiseInfoService
                .editFranchiseLogo(newEditPostDto)
                .subscribe(editLogoResponse => {
                  console.log("editLogoResponse is : ", editLogoResponse.data);
                  if (this.franchiseInfo.logo != null) {
                    const delFile = this.storage.storage.refFromURL(
                      this.franchiseInfo.logo
                    );
                    delFile.delete().then(deletedFile => {
                      this.franchiseInfo.logo =
                        editLogoResponse.data.franchise_logo;
                    });
                  } else {
                    this.franchiseInfo.logo =
                      editLogoResponse.data.franchise_logo;
                    console.log("No Logo for this franchise exists Yet");
                  }
                  this.toaster.popSuccess(
                    "Franchise Logo Updated Successfully"
                  );
                });
            });
          })
        )
        .subscribe();
    } else {
      console.log("Edit Logo Form is Not valid");
    }
  }

  onEditBannerSubmit() {
    if (this.editBannerForm.valid) {
      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const filePath =
        "banners/" + randomString + "-" + this.editBannerImageFile.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.editBannerImageFile);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              let newEditPostDto = {
                image: url,
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              this.franchiseInfoService
                .editFranchiseBanner(newEditPostDto)
                .subscribe(editBannerResponse => {
                  console.log(
                    "editBannerResponse is : ",
                    editBannerResponse.data
                  );
                  if (this.franchiseInfo.welcomeImage != null) {
                    const delFile = this.storage.storage.refFromURL(
                      this.franchiseInfo.welcomeImage
                    );
                    delFile.delete().then(deletedFile => {
                      this.franchiseInfo.welcomeImage =
                        editBannerResponse.data.welcome_image;
                    });
                  } else {
                    this.franchiseInfo.welcomeImage =
                      editBannerResponse.data.welcome_image;
                    console.log("No Banner for this franchise exists Yet");
                  }
                  this.toaster.popSuccess(
                    "Franchise Banner Updated Successfully"
                  );
                });
            });
          })
        )
        .subscribe();
    } else {
      console.log("Edit Banner Form is Not valid");
    }
  }
}
