import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FranchiseDealsService } from '../../services/franchiseDeals.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  IsButton,
  IsModalService,
  IsModal,
  IsModalSize
} from '../../../../lib';
import { IsToasterService, IsToastPosition } from '../../../../lib/toaster';
import { dealModel } from '../../models/dealModel';
import { EditDealDialogBoxComponent } from '../../components/edit-deal-dialog-box/edit-deal-dialog-box.component';
import { AddDealDialogBoxComponent } from '../../components/add-deal-dialog-box/add-deal-dialog-box.component';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss']
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
  dealAddCancelled = false;
  @ViewChild('dealImage') dealImage: ElementRef;
  @ViewChild('edealImage') edealImage: ElementRef;

  constructor(
    private franchiseDealsService: FranchiseDealsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private dataService: DataService
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

  populateDeals() {
    this.franchiseDealsService
    .getDeals(this.dataService.franchiseId)
    .subscribe(responseData => {
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
        mode: 'editing',
        deal: this.editDeal
      },
      backdrop: 'static',
      size: IsModalSize.Large
    });

    addDealDialog.onClose.subscribe(res => {
      if (res !== 'cancel' && res.mode === 'editing') {
        this.updateDeal(res.deal);
      }
    });

    // const deleteModal = this.isModal.open(AddDealDialogBoxComponent, {
    //   data: {
    //     mode: 'editing',
    //     deal: this.editDeal
    //   },
    //   backdrop: 'static',
    //   size: IsModalSize.Large
    // });

    // deleteModal.onClose.subscribe(res => {
    //   if (res === 'cancel') {
    //     this.dealEditCancelled = true;
    //   } else if (res === 0) {
    //     this.dealEditCancelled = true;
    //   } else if (!this.dealEditCancelled) {
    //     this.franchiseDealsService
    //       .editDeal(res, this.editDeal.id)
    //       .subscribe(responseData => {
    //         this.newDeal = responseData.data;
    //         this.showDeals = true;
    //         const editDealIndex = this.deals
    //           .map(deal => deal.id)
    //           .indexOf(this.editDeal.id);
    //         this.deals[editDealIndex] = this.newDeal;
    //         this.storage.storage.refFromURL(this.imageToBeDeleted).delete();
    //         this.toaster.popSuccess('Deal Has Been Edited Successfully');
    //       });
    //   }
    // });
  }

  onDeleteDealHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: 'Are Your Sure you want to Delete this Deal ?'
    });
    deleteModal.onClose.subscribe(res => {
      if (res === 'ok') {
        let delDeal = this.deals.filter(deal => deal.id == id);
        this.deleteDeal = delDeal[0];
        const delFile = this.storage.storage.refFromURL(
          this.deleteDeal.deal_image
        );
        delFile.delete().then(deletedFile => {
          this.franchiseDealsService.deleteDeal(id).subscribe(response => {
            this.toaster.popSuccess('Deal Has Been Deleted Successfully', {
              position: IsToastPosition.BottomRight
            });
            this.deals = this.deals.filter(deal => deal.id != id);
          });
        });
      }
    });
  }

  onAddDealClickHandler() {
    this.dealAddCancelled = false;
    const addDealDialog = this.isModal.open(AddDealDialogBoxComponent, {
      data: {
        mode: 'new'
      },
      backdrop: 'static',
      size: IsModalSize.Large
    });

    addDealDialog.onClose.subscribe(res => {

      if (res !== 'cancel' && res.mode === 'new') {
        this.saveDealData(res.deal);
      }
    });
  }

  private updateDeal(deal: dealModel) {
    this.franchiseDealsService
          .editDeal(deal, this.editDeal.id)
          .subscribe(responseData => {
            this.newDeal = responseData.data;
            this.showDeals = true;
            const editDealIndex = this.deals
              .map(deal => deal.id)
              .indexOf(this.editDeal.id);
            this.deals[editDealIndex] = this.newDeal;
            this.storage.storage.refFromURL(this.imageToBeDeleted).delete();
            this.toaster.popSuccess('Deal Has Been Edited Successfully');
          });
  }


  private saveDealData(deal: dealModel) {
    this.franchiseDealsService.addDeal(deal).subscribe(addDealResponse => {
          
      this.toaster.popSuccess('Deal Has Been Added Successfully', {
        position: IsToastPosition.BottomRight
      });
      this.populateDeals();
    });
  }
}
