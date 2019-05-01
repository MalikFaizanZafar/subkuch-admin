import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IsActiveModal, IsButton } from 'app/lib';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'edit-banner-dialog-box',
  templateUrl: './edit-banner-dialog-box.component.html',
  styleUrls: ['./edit-banner-dialog-box.component.scss']
})
export class EditBannerDialogBoxComponent implements OnInit {
  editBrandName;
  editBannerImageFile;
  tempEditBannerImage;
  editBannerForm: FormGroup;
  downloadURL: Observable<string>;
  bannerImageChanged: boolean = false;
  @ViewChild("bannerImage") bannerImage: ElementRef;
  constructor( private isActiveModal : IsActiveModal,  private storage: AngularFireStorage) { }

  ngOnInit() {
    this.editBannerImageFile = this.isActiveModal.data.banner
    this.tempEditBannerImage = this.isActiveModal.data.banner
    this.editBrandName = this.isActiveModal.data.brandName
    this.editBannerForm = new FormGroup({
      editBannerImage: new FormControl(null, [Validators.required])
    });
  }

  onEditBannerChooseImage() {
    this.bannerImage.nativeElement.click();
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
    this.bannerImageChanged = true
  }

  onEditBannerSubmit(btn : IsButton) {
    if (this.editBannerForm.valid) {
      if(this.bannerImageChanged){
        btn.startLoading()
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
              let editBannerPostDto = {
                image: url,
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              btn.stopLoading()
              this.isActiveModal.close(editBannerPostDto)
            });
          })
        )
        .subscribe();
      }else {
        let editBannerPostDto = {
          image: this.editBannerImageFile,
          franchise_id: Number(localStorage.getItem("franchiseId"))
        };
        btn.stopLoading()
        this.isActiveModal.close(editBannerPostDto)
      }
    }
  }

}
