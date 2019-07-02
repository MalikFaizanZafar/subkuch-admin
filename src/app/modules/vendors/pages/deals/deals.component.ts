import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  TemplateRef,
  OnDestroy
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseDealsService } from "../../services/franchiseDeals.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import {
  IsButton,
  IsModalService,
  IsModal,
  IsModalSize
} from "../../../../lib";
import { IsToasterService, IsToastPosition } from "../../../../lib/toaster";
import { dealModel } from "../../models/dealModel";
import { EditDealDialogBoxComponent } from "../../components/edit-deal-dialog-box/edit-deal-dialog-box.component";
import { AddDealDialogBoxComponent } from "../../components/add-deal-dialog-box/add-deal-dialog-box.component";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "@app/shared/services/data.service";

@Component({
  selector: "deals",
  templateUrl: "./deals.component.html",
  styleUrls: ["./deals.component.scss"]
})
export class DealsComponent implements OnInit, OnDestroy {
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
  dealAddCancelled = false;
  @ViewChild("dealImage") dealImage: ElementRef;
  @ViewChild("edealImage") edealImage: ElementRef;
  loading = false;

  /**
   * Subscription to be triggered on destroy cycle of component.
   */
  private destroy: Subject<null> = new Subject();

  constructor(
    private franchiseDealsService: FranchiseDealsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.populateDeals();
    });

    this.dealForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      discountEnd: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
  }

  /**
   * Destroy life cycle of the component.
   */
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  populateDeals() {
    this.loading = true;
    this.franchiseDealsService
      .getDeals(this.dataService.franchiseId)
      .pipe(
        finalize(() => (this.loading = false)),
        takeUntil(this.destroy)
      )
      .subscribe(responseData => {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { franchiseId: this.dataService.franchiseId }
        });
        this.deals = responseData.data;
      });
  }

  onEditDealHandler(id) {
    let filterdDeals = this.deals.filter(meal => meal.id == id);
    this.editDeal = filterdDeals[0];
    this.imageToBeDeleted = this.editDeal.deal_image;
    this.dealEditCancelled = false;
    const addDealDialog = this.isModal.open(AddDealDialogBoxComponent, {
      data: {
        mode: "editing",
        deal: this.editDeal
      },
      backdrop: "static",
      size: IsModalSize.Large
    });

    addDealDialog.onClose.subscribe(res => {
      if (res !== "cancel" && res.mode === "editing") {
        this.updateDeal(res.deal, res.imageDeleted);
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
          this.franchiseDealsService.deleteDeal(id).subscribe(response => {
            if (this.deleteDeal.deal_image.includes("firebasestorage")) {
              this.storage.storage
                .refFromURL(this.deleteDeal.deal_image)
                .getDownloadURL()
                .then(image => {
                  this.storage.storage.refFromURL(this.deleteDeal.deal_image).delete();
                })
                .catch(error => console.log("error is : ", error));
            } else {
              console.log("Image is NOT from Firestorage");
            }
            this.toaster.popSuccess("Deal Has Been Deleted Successfully", {
              position: IsToastPosition.BottomRight
            });
            this.deals = this.deals.filter(deal => deal.id != id);
          });
      }
    });
  }

  onAddDealClickHandler() {
    this.dealAddCancelled = false;
    const addDealDialog = this.isModal.open(AddDealDialogBoxComponent, {
      data: {
        mode: "new"
      },
      backdrop: "static",
      size: IsModalSize.Large
    });

    addDealDialog.onClose.subscribe(res => {
      if (res !== "cancel" && res.mode === "new") {
        this.saveDealData(res.deal);
      }
    });
  }

  private updateDeal(deal: dealModel, imageDeleted: boolean) {
    var dateobj = new Date(deal.endTime);
    var end = dateobj.toISOString();
    deal.endTime = end;
    var dateobj2 = new Date(deal.startTime);
    var start = dateobj2.toISOString();
    deal.startTime = start;
    this.franchiseDealsService
      .editDeal(deal, this.editDeal.id)
      .subscribe(responseData => {
        this.newDeal = responseData.data;
        this.showDeals = true;
        const editDealIndex = this.deals.findIndex(
          deal => deal.id === this.editDeal.id
        );
        this.deals[editDealIndex] = this.newDeal;
        if (imageDeleted) {
          if (this.imageToBeDeleted.includes("firebasestorage")) {
            this.storage.storage
              .refFromURL(this.imageToBeDeleted)
              .getDownloadURL()
              .then(image => {
                this.storage.storage.refFromURL(this.imageToBeDeleted).delete();
              })
              .catch(error => console.log("error is : ", error));
          } else {
            console.log("Image is NOT from Firestorage");
          }
        }
        this.toaster.popSuccess("Deal Has Been Edited Successfully", {
          position: IsToastPosition.BottomRight
        });
      });
  }

  private saveDealData(deal: dealModel) {
    var dateobj = new Date(deal.endTime);
    var end = dateobj.toISOString();
    deal.endTime = end;
    var dateobj2 = new Date(deal.startTime);
    var start = dateobj2.toISOString();
    deal.startTime = start;
    console.log("new deal is : ", deal);
    this.franchiseDealsService.addDeal(deal).subscribe(addDealResponse => {
      console.log("saved deal is : ", addDealResponse);
      this.toaster.popSuccess("Deal Has Been Added Successfully", {
        position: IsToastPosition.BottomRight
      });
      this.populateDeals();
    });
  }

  imageDeleteTest() {
    console.log("imageDeleteTest");
    let tempImage =
      "https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    if (tempImage.includes("firebasestorage")) {
      console.log("Image is from Firestorage");
    } else {
      console.log("Image is NOT from Firestorage");
    }
    this.storage.storage
      .refFromURL(
        "https://firebasestorage.googleapis.com/v0/b/subquch-d4369.appspot.com/o/deals%2FCap.PNG?alt=media&token=7a8cd798-d725-4eb1-b864-b7349ce83003"
      )
      .getDownloadURL()
      .then(image => {
        console.log("image is : ", image);
      })
      .catch(error => console.log("error is : ", error));
  }
}
