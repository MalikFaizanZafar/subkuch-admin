import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsActiveModal } from "app/lib";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
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
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.editDeal = this.isActiveModal.data;
    console.log("editDeal inside dialogbox is : ", this.editDeal);
    this.tempDealImage = this.editDeal.dealImage;
    const dateObj = this.editDeal.endDate.split("T")[0];
    this.editDealForm = new FormGroup({
      name: new FormControl(this.editDeal.name, [Validators.required]),
      price: new FormControl(this.editDeal.price, [Validators.required]),
      discountEnd: new FormControl(dateObj, [Validators.required]),
      attachment: new FormControl(null)
    });
  }
  onEditDealSubmit() {
    console.log("Edit Deal Submitted", this.editDealForm.valid);
    if (this.editDealForm.valid) {
      let dealVals = this.editDealForm.value;
      let newDeal = {
        name: dealVals.name,
        price: dealVals.price,
        end_date: dealVals.discountEnd,
        franchise_id: Number(localStorage.getItem("franchiseId")),
        deal_image: ""
      };
      if (!this.dealImageFileChanged) {
        console.log("dealImageFileChanged false ")
        newDeal.deal_image = this.editDeal.dealImage;
        console.log("newDeal when file NOT changed is : ", newDeal)
        this.isActiveModal.close(newDeal);
      } else {
        console.log("dealImageFileChanged true ")
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
            console.log("newDeal when file changed is : ", newDeal)
            this.isActiveModal.close(newDeal);
          });
        })
      )
      .subscribe();
      }
    }
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
