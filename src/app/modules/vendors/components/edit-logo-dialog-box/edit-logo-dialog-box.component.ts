import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IsModalService, IsActiveModal, IsButton } from 'app/lib';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'edit-logo-dialog-box',
  templateUrl: './edit-logo-dialog-box.component.html',
  styleUrls: ['./edit-logo-dialog-box.component.scss']
})
export class EditLogoDialogBoxComponent implements OnInit {
  editBrandName;
  editLogoImageFile;
  tempEditLogoImage;
  editLogoForm: FormGroup;
  downloadURL: Observable<string>;
  logoImageChanged: boolean = false;
  @ViewChild("logoImage") logoImage: ElementRef;
  constructor(private isModal : IsModalService, private isActiveModal : IsActiveModal,  private storage: AngularFireStorage) { }

  ngOnInit() {
    console.log("this.isActiveModal.data is ", this.isActiveModal.data)
    this.editLogoImageFile = this.isActiveModal.data.logo
    this.tempEditLogoImage = this.isActiveModal.data.logo
    this.editBrandName = this.isActiveModal.data.brandName
    this.editLogoForm = new FormGroup({
      editLogoImage: new FormControl(null, [Validators.required])
    });
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
    this.logoImageChanged = true
  }

  onEditLogoSubmit(btn : IsButton) {
    if (this.editLogoForm.valid) {
      if(this.logoImageChanged){
        btn.startLoading()
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
              let editLogoPostDto = {
                image: url,
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              btn.stopLoading()
              this.isActiveModal.close(editLogoPostDto)
            });
          })
        )
        .subscribe();
      }else {
        let editLogoPostDto = {
          image: this.editLogoImageFile,
          franchise_id: Number(localStorage.getItem("franchiseId"))
        };
        btn.stopLoading()
        this.isActiveModal.close(editLogoPostDto)
      }
    } else {
      console.log("Edit Logo Form is Not valid");
    }
  }
}
