import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MemberDetails } from '../../models/vendor-members';
import { EditMainService } from '../../services/editMain.service';
import { FranchiseInfoService } from '../../services/franchiseInfo.service';
import { IsButton, IsModalService, IsModalSize } from 'app/lib';
import { EditLogoDialogBoxComponent } from '../../components/edit-logo-dialog-box/edit-logo-dialog-box.component';
import { EditBannerDialogBoxComponent } from '../../components/edit-banner-dialog-box/edit-banner-dialog-box.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { finalize } from 'rxjs/operators';
import { DataService } from '@app/shared/services/data.service';
declare const google: any;

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  user: MemberDetails;
  isEditingMode: boolean = false;
  franchiseInfo: any = {};
  editBtnEnabled: boolean;
  logoEditCancelled: boolean = false;
  bannerEditCancelled: boolean = false;
  ratingArray: string[] = ['1', '2', '3', '4', '5'];
  editLogoImageFile;
  tempEditLogoImage;
  editBannerImageFile;
  tempEditBannerImage;
  notificationCount: number = 0;
  loading = false;

  constructor(
    private franchiseInfoService: FranchiseInfoService,
    private editMainService: EditMainService,
    private isModal: IsModalService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (
        params['franchiseId'] !== undefined &&
        this.franchiseInfo.isAdmin &&
        this.franchiseInfo.franchises !== null &&
        this.franchiseInfo.franchises.find(
          item => item.id === parseInt(params['franchiseId'], 10)
        )
      ) {
        this.franchiseInfo = this.franchiseInfo.franchises.find(
          item => item.id === parseInt(params['franchiseId'], 10)
        );
        this.dataService.setFranchiseId(this.franchiseInfo.id);
      } else {
        this.loading = true;
        this.franchiseInfoService
          .getFranchiseInfo()
          .pipe(finalize(() => (this.loading = false)))
          .subscribe(res => {
            this.franchiseInfo = res.data;
            this.dataService.setFranchiseId(this.franchiseInfo.id);
            if (!this.franchiseInfo.address) {
              this.setEditingMode();
            }
          });
      }
    });
  }

  getFranshiseBanner() {
    return (
      this.franchiseInfo.welcomeImage ||
      `https://via.placeholder.com/1100x200.png?text=upload+your+banner+here`
    );
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
  get startTime() {
    const time = new Date(this.franchiseInfo.startTime);
    return `${time.getHours()}:00`;
  }

  get endTime() {
    const time = new Date(this.franchiseInfo.endTime);
    return `${time.getHours()}:00`;
  }

  setEditingMode() {
    this.isEditingMode = true;
    this.editMainService.editEnable.next(true);
  }

  cancelEditing() {
    this.isEditingMode = false;
    this.editMainService.editEnable.next(false);
  }

  overviewEditedHandler() {
    this.isEditingMode = false;
    this.editMainService.editEnable.next(false);
  }
}
