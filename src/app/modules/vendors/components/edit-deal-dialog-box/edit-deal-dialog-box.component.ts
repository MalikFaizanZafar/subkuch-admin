import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsActiveModal, IsButton } from "app/lib";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DataService } from "@app/shared/services/data.service";
@Component({
  selector: "edit-deal-dialog-box",
  templateUrl: "./edit-deal-dialog-box.component.html",
  styleUrls: ["./edit-deal-dialog-box.component.scss"]
})
export class EditDealDialogBoxComponent implements OnInit {
  editDealForm: FormGroup;
  tempDealImage;
  imageFile;
  editDeal;
  dealImageFileChanged: boolean = false;
  downloadURL: Observable<string>;
  @ViewChild("dealImageInputBtn") dealImageInputBtn: ElementRef;

  constructor(
    private isActiveModal: IsActiveModal,
    private storage: AngularFireStorage,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dealImageFileChanged = false;
    this.editDeal = this.isActiveModal.data;
    this.tempDealImage = this.editDeal.dealImage;
    const dateObj = this.editDeal.endDate.split("T")[0];
    this.editDealForm = new FormGroup({
      name: new FormControl(this.editDeal.name, [Validators.required]),
      price: new FormControl(this.editDeal.price, [Validators.required]),
      discountEnd: new FormControl(dateObj, [Validators.required]),
      attachment: new FormControl(null)
    });
  }
  onEditDealSubmit(btn: IsButton) {
    if (this.editDealForm.valid) {
      btn.startLoading();
      let dealVals = this.editDealForm.value;
      let newDeal = {
        name: dealVals.name,
        price: dealVals.price,
        end_date: dealVals.discountEnd,
        franchise_id: this.dataService.franchiseId,
        deal_image: ""
      };
      if (this.dealImageFileChanged) {
        let randomString =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        const filePath = "deals/" + randomString + "-" + this.imageFile.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.imageFile);
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                newDeal.deal_image = url;
                this.dealImageFileChanged = false;
                btn.stopLoading();
                this.isActiveModal.close(newDeal);
              });
            })
          )
          .subscribe();
      } else {
        newDeal.deal_image = this.editDeal.dealImage;
        btn.stopLoading();
        this.isActiveModal.close(newDeal);
        this.dealImageFileChanged = false;
      }
    }
  }
  onCancelEditDeal() {
    this.dealImageFileChanged = false;
    this.isActiveModal.close("cancel");
  }
  dealImageChangeEvent(fileInput: any) {
    this.imageFile = fileInput.target.files[0];
    const self = this;
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.tempDealImage = dataURL;
    };
    reader.readAsDataURL(fileInput.target.files[0]);
    this.dealImageFileChanged = true;
  }

  chooseFile() {
    this.dealImageInputBtn.nativeElement.click();
  }
}
