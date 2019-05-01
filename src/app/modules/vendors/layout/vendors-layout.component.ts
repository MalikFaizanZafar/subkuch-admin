import {
  Component,
  OnInit,
  HostBinding,
  ViewChild,
  TemplateRef,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { MemberDetails } from '../models/vendor-members';
import { EditMainService } from '../services/editMain.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IsButton, IsModalService, IsModalSize } from '../../../lib';
import { IsToasterService, IsToastPosition } from '../../../lib/toaster';
import { FranchiseInfoService } from '../services/franchiseInfo.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationsService } from 'app/services/notifications.service';
import { EditLogoDialogBoxComponent } from '../components/edit-logo-dialog-box/edit-logo-dialog-box.component';
import { EditBannerDialogBoxComponent } from '../components/edit-banner-dialog-box/edit-banner-dialog-box.component';
import { SidebarLinks } from '../models/sidebar-links';
import { ViewOrderNotificationDialogComponent } from '../components/view-order-notification-dialog/view-order-notification-dialog.component';
import { FranchiseOrdersService } from '../services/franchiseOrders.service';

@Component({
  selector: 'app-vendors-layout',
  templateUrl: './vendors-layout.component.html',
  styleUrls: ['./vendors-layout.component.scss']
})
export class VendorsLayoutComponent implements OnInit {
  @HostBinding() class: string =
    'd-flex flex-column col p-0 overflow-y-auto overflow-x-hidden';
  user: MemberDetails;
  editBtnEnabled: boolean;
  editLogoForm: FormGroup;
  editBannerForm: FormGroup;
  ratingArray: string[] = ['1', '2', '3', '4', '5'];
  editLogoImageFile;
  tempEditLogoImage;
  editBannerImageFile;
  tempEditBannerImage;
  notificationCount: number = 0;

  autoGenerateLinks = SidebarLinks;
  franchiseInfo: any = {};
  downloadURL: Observable<string>;
  logoEditCancelled: boolean = false;
  bannerEditCancelled: boolean = false;
  @ViewChild('logoImage') logoImage: ElementRef;
  @ViewChild('bannerImage') bannerImage: ElementRef;
  
  constructor(
    private router: Router,
    private franchiseInfoService: FranchiseInfoService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private editMainService: EditMainService,
    private storage: AngularFireStorage,
    private notificationService: NotificationsService,
    private franchiseOrdersService : FranchiseOrdersService
  ) {}

  ngOnInit() {
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

    this.listenNotification();
    // this.listenBackgroundNotification();
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
    const viewNotificationsDialog = this.isModal.open(ViewOrderNotificationDialogComponent, {size : IsModalSize.Large})
    viewNotificationsDialog.onClose.subscribe(res => {
      if(res === 'ok'){
        this.franchiseOrdersService.removeNewOrders()
      }
    })
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
    this.router.navigate(['auth']);
  }

  onEditLogoHandler() {
    this.logoEditCancelled = false;
    const editLogoDlg = this.isModal.open(EditLogoDialogBoxComponent, {
      data: {
        logo: this.franchiseInfo.logo,
        brandName: this.franchiseInfo.brandName
      }
    });
    editLogoDlg.onClose.subscribe(res => {
      if (res === 'cancel') {
        this.logoEditCancelled = true;
      } else if (!this.logoEditCancelled) {
        this.franchiseInfoService
          .editFranchiseLogo(res)
          .subscribe(editLogoResponse => {
            this.franchiseInfo.logo = editLogoResponse.data.franchise_logo;
          });
      }
    });
  }
  onEditBannerHandler() {
    this.bannerEditCancelled = false;
    const editBannerDlg = this.isModal.open(EditBannerDialogBoxComponent, {
      size: IsModalSize.Large,
      data: {
        banner: this.franchiseInfo.welcomeImage,
        brandName: this.franchiseInfo.brandName
      }
    });
    editBannerDlg.onClose.subscribe(res => {
      if (res === 'cancel') {
        this.bannerEditCancelled = true;
      } else if (!this.bannerEditCancelled) {
        this.franchiseInfoService
          .editFranchiseBanner(res)
          .subscribe(editLogoResponse => {
            this.franchiseInfo.welcomeImage =
              editLogoResponse.data.welcome_image;
          });
      }
    });
  }
}
