import { Component, OnInit, ElementRef, ViewChild  } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseDealsService } from "../../services/franchiseDeals.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { dealModel } from "../../models/dealModel";

@Component({
  selector: "deals",
  templateUrl: "./deals.component.html",
  styleUrls: ["./deals.component.scss"]
})
export class DealsComponent implements OnInit {
  deals: any = [];
  dealForm: FormGroup;
  newDeal: dealModel
  showDeals: boolean = true;
  showEditDeal: boolean = false;
  downloadURL: Observable<string>;
  imageFile;
  @ViewChild("dealImage") dealImage: ElementRef;
  constructor(private franchiseDealsService: FranchiseDealsService, private storage: AngularFireStorage) {}

  ngOnInit() {
    this.franchiseDealsService.getDeals(1).subscribe(responseData => {
      this.deals = responseData.data;
      console.log('this.deals has : ', this.deals)
    });
    this.dealForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(1),
      discountEnd: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
  }

  fileChangeEvent(fileInput : any) {
    this.imageFile = fileInput.target.files[0];
  }
  chooseFile() {
    console.log("choose an image");
    this.dealImage.nativeElement.click();
  }

  onDealSubmit(form: FormGroup) {
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
            if (this.dealForm.valid) {
              let deal = this.dealForm.value;
              this.newDeal = {
                name: deal.name,
                price: deal.price,
                deal_image: url,
                end_date: deal.discountEnd,
                franchise_id: 6
              };
              this.franchiseDealsService
                .addDeal(this.newDeal)
                .subscribe(responseData => {
                  this.newDeal = responseData.data;
                  this.showDeals = true;
                  this.deals.push(this.newDeal)
                  console.log("this.newDeal : ", this.newDeal);
                  this.dealForm.reset();
                });
            } else {
              return;
            }
          });
        })
      )
      .subscribe();
  }
}
