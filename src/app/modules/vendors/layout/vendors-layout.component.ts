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
  ratingArray: string[] = ["1", "2", "3", "4"];
  editLogoImageFile;
  tempEditLogoImage;
  autoGenerateLinks = [
    {
      label: "Overview",
      icon: "fa-table",
      link: "overview/"
    },
    {
      icon: "fa-bars",
      label: "Deals",
      link: "deals/"
    },
    {
      icon: "fa-bars",
      label: "Meals",
      link: "meals/"
    },
    {
      icon: "fa-bars",
      label: "Orders",
      link: "orders/"
    },
    {
      icon: "fa-bars",
      label: "Sales",
      link: "sales/"
    }
  ];
  franchiseInfo: any = {};
  @ViewChild("logoImage") logoImage: ElementRef;
  constructor(
    private router: Router,
    private franchiseInfoService: FranchiseInfoService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private editMainService: EditMainService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.editLogoForm = new FormGroup({
      editLogoImage: new FormControl(null, [Validators.required])
    });
    this.franchiseInfoService.getFranchiseInfo().subscribe(responseData => {
      this.franchiseInfo = responseData.data;
      this.tempEditLogoImage = this.franchiseInfo.logo;
    });
    this.editMainService.editEnable.subscribe(val => {
      this.editBtnEnabled = val;
    });
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
    console.log("this.editLogoImageFile", this.editLogoImageFile);
  }
  onEditLogoHandler(editLogoDialog: TemplateRef<any>) {
    const editLogoDlg = this.isModal.open(editLogoDialog);
    editLogoDlg.onClose.subscribe(res => {
      if (res === "ok") {
        console.log("Edit Dialog Ok");
        let randomString =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        const filePath = "items/" + randomString + "-" + this.editLogoImageFile.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.editLogoImageFile);
        
        // const delFile = this.storage.storage.refFromURL(
        //   this.franchiseInfo.logo
        // );
      }
    });
  }
  onEditLogoSubmit() {
    if (this.editLogoForm.valid) {
      console.log("Edit Logo Form is valid", this.editLogoForm);
    } else {
      console.log("Edit Logo Form is Not valid");
    }
  }
}
