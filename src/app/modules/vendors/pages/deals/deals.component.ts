import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseDealsService } from "../../services/franchiseDeals.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { IsButton, IsModalService } from "../../../../lib";
import { IsToasterService } from "../../../../lib/toaster";
import { dealModel } from "../../models/dealModel";
import { FranchiseInfoService } from "../../services/franchiseInfo.service";

@Component({
  selector: "deals",
  templateUrl: "./deals.component.html",
  styleUrls: ["./deals.component.scss"]
})
export class DealsComponent implements OnInit {
  deals: any = [];
  dealForm: FormGroup;
  newDeal: dealModel;
  showDeals: boolean = true;
  editDeal: {};
  deleteDeal;
  showEditDeal: boolean = false;
  downloadURL: Observable<string>;
  imageFile;
  @ViewChild("dealImage") dealImage: ElementRef;
  constructor(
    private franchiseDealsService: FranchiseDealsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.franchiseDealsService.getDeals(6).subscribe(responseData => {
      this.deals = responseData.data;
      console.log("this.deals has : ", this.deals);
    });
    this.dealForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(1),
      discountEnd: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
  }

  fileChangeEvent(fileInput: any) {
    this.imageFile = fileInput.target.files[0];
  }
  chooseFile() {
    console.log("choose an image");
    this.dealImage.nativeElement.click();
  }

  onEditDealHandler(id) {
    let filterdDeals = this.deals.filter(meal => meal.id == id);
    this.editDeal = filterdDeals[0];
    // this.showEditDeal = true;
    // this.showDeals = false;
    console.log("Edit Deal is : ", this.editDeal);
  }
  onDeleteDealHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: "Are Your Sure you want to Delete this Deal ?"
    });
    deleteModal.onClose.subscribe(res => {
      if (res === "ok") {
        let delDeal = this.deals.filter(deal => deal.id == id);
        this.deleteDeal = delDeal[0];
        const delFile = this.storage.storage.refFromURL(
          this.deleteDeal.dealImage
        );
        delFile.delete().then(deletedFile => {
          this.franchiseDealsService.deleteDeal(id).subscribe(response => {
            console.log("Response from Server : ", response);
            this.toaster.popSuccess("Deal Has Been Deleted Successfully");
            this.deals = this.deals.filter(deal => deal.id != id);
          });
        });
      }
    });
  }

  onDealSubmit(form: FormGroup, btn: IsButton) {
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
            if (this.dealForm.valid) {
              let deal = this.dealForm.value;
              this.newDeal = {
                name: deal.name,
                price: deal.price,
                deal_image: url,
                end_date: deal.discountEnd,
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              this.franchiseDealsService
                .addDeal(this.newDeal)
                .subscribe(responseData => {
                  this.newDeal = responseData.data;
                  this.showDeals = true;
                  this.deals.push(this.newDeal);
                  btn.stopLoading();
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
