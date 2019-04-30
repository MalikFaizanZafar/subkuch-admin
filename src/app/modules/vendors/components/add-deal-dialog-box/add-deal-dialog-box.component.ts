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
  imageFile;
  constructor() {}
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
}
