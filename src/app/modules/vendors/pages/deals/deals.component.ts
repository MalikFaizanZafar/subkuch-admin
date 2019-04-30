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
import { IsButton, IsModalService, IsModal, IsModalSize } from "../../../../lib";
import { IsToasterService } from "../../../../lib/toaster";
import { dealModel } from "../../models/dealModel";
import { EditDealDialogBoxComponent } from "../../components/edit-deal-dialog-box/edit-deal-dialog-box.component";
import { AddDealDialogBoxComponent } from "../../components/add-deal-dialog-box/add-deal-dialog-box.component";

@Component({
  selector: "deals",
  templateUrl: "./deals.component.html",
  styleUrls: ["./deals.component.scss"]
})
export class DealsComponent implements OnInit {
  deals: any = [];
  dealForm: FormGroup;
  editDealForm: FormGroup;
  newDeal: dealModel;
  showDeals: boolean = true;
  editDeal;
  deleteDeal;
  showEditDeal: boolean = false;
  downloadURL: Observable<string>;
  imageFile;
  eimageFile;
  tempDealImageFile;
  imageToBeDeleted;
  dealEditCancelled = false;
  @ViewChild("dealImage") dealImage: ElementRef;
  @ViewChild("edealImage") edealImage: ElementRef;
  constructor(
    private franchiseDealsService: FranchiseDealsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.franchiseDealsService
      .getDeals(Number(localStorage.getItem("franchiseId")))
      .subscribe(responseData => {
        this.deals = responseData.data;
      });
    this.dealForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      discountEnd: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
  }

  editDealImageChangeEvent(fileInput: any) {
    this.eimageFile = fileInput.target.files[0];
    const self = this;
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.tempDealImageFile = dataURL;
    };
    reader.readAsDataURL(fileInput.target.files[0]);
  }

  echooseFile() {
    this.edealImage.nativeElement.click();
  }
  onEditDealHandler(id) {
    let filterdDeals = this.deals.filter(meal => meal.id == id);
    this.editDeal = filterdDeals[0];
    this.imageToBeDeleted = this.editDeal.dealImage;
    this.dealEditCancelled = false;
    const deleteModal = this.isModal.open(EditDealDialogBoxComponent, {
      data: this.editDeal
    });
    deleteModal.onClose.subscribe(res => {
      if (res === "cancel") {
        this.dealEditCancelled = true;
      } else if (!this.dealEditCancelled) {
        this.franchiseDealsService
          .editDeal(res, this.editDeal.id)
          .subscribe(responseData => {
            this.newDeal = responseData.data;
            this.showDeals = true;
            const editDealIndex = this.deals
              .map(deal => deal.id)
              .indexOf(this.editDeal.id);
            this.deals[editDealIndex] = this.newDeal;
            this.storage.storage.refFromURL(this.imageToBeDeleted).delete();
          });
      }
    });
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
  onAddDealClickHandler() {
    this.isModal.open(AddDealDialogBoxComponent, { size : IsModalSize.Large})
  }
  onDealSubmit(form: FormGroup, btn: IsButton) {
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
            });
          })
        )
        .subscribe();
    } else {
      console.log("Form is not Valid");
    }
  }
}
