import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsActiveModal, IsButton } from "app/lib";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
@Component({
  selector: "add-deal-dialog-box",
  templateUrl: "./add-deal-dialog-box.component.html",
  styleUrls: ["./add-deal-dialog-box.component.scss"]
})
export class AddDealDialogBoxComponent implements OnInit {
  dealForm: FormGroup;
  newDeal;
  imageFile;
  downloadURL: Observable<string>;
  constructor(private isActiveModal : IsActiveModal, private storage: AngularFireStorage) {}
  @ViewChild("dealImage") dealImage: ElementRef;
  ngOnInit() {
    this.dealForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      discountEnd: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
  }

  fileChangeEvent(fileInput: any) {
    this.imageFile = fileInput.target.files[0];
  }
  
  chooseFile() {
    this.dealImage.nativeElement.click();
  }

  onDealSubmit( btn: IsButton) {
    if (this.dealForm.valid) {
      btn.startLoading();
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
              let deal = this.dealForm.value;
              this.newDeal = {
                name: deal.name,
                price: deal.price,
                deal_image: url,
                end_date: deal.discountEnd,
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              this.isActiveModal.close(this.newDeal)
            });
          })
        )
        .subscribe();
    }
  }
}
