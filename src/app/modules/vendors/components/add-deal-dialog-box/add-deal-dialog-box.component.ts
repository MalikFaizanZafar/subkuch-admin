import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IsActiveModal, IsButton } from 'app/lib';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { DataService } from '@app/shared/services/data.service';
import { FranchiseItemsService } from '../../services/franchiseItems.service';
import { dealModel } from '../../models/dealModel';


const startTime: Date = new Date();
startTime.setHours(0);
startTime.setMinutes(1);
const endTime: Date = new Date();
endTime.setHours(23);
endTime.setMinutes(59);

interface ItemsList {
  quantity?: number;
  item?: any;
  editing?: boolean;
}

interface DealItems {
  id?: number;
  quantity?: number;
}

@Component({
  selector: 'add-deal-dialog-box',
  templateUrl: './add-deal-dialog-box.component.html',
  styleUrls: ['./add-deal-dialog-box.component.scss']
})
export class AddDealDialogBoxComponent implements OnInit, OnDestroy {
  dealForm: FormGroup;
  newDeal;
  imageFile;
  downloadURL: Observable<string>;
  @ViewChild('dealImage') dealImage: ElementRef;
  items: any;
  itemLoading: boolean = false
  itemsList: ItemsList[] = [ {quantity: 1, editing: true}];
  showItemError: boolean = false;
  showQuantityError: boolean = false;
  dealItemsList: DealItems[] = [];
  showItemsError: boolean = false;
  isSubmitted: boolean = false;
  deals: dealModel;
  dealImageChanged: boolean = false;
  addOrEdit =  'Add'
  /**
   * Subscription to be triggered on destroy cycle of component.
   */
  private destroy: Subject<null> = new Subject();

  constructor(
    private isActiveModal: IsActiveModal,
    private franchiseItemsService: FranchiseItemsService,
    private storage: AngularFireStorage,
    private dataService: DataService
  ) {}

  ngOnInit() {
    console.log("data has : ", this.isActiveModal.data.deal)
    if (this.isActiveModal.data.mode === 'editing') {
      this.addOrEdit = 'Edit'
      this.deals = this.isActiveModal.data.deal;
    }

    this.dealForm = new FormGroup({
      name: new FormControl(this.deals ? this.deals.name : null, [Validators.required]),
      price: new FormControl(this.deals ? this.deals.price : null, [Validators.required]),
      discountEnd: new FormControl(this.deals ? this.deals.end_date : null),
      attachment: new FormControl(null,  this.setImageValidator()),
      subtitle: new FormControl(this.deals ? this.deals.subtitle :  null),
      description: new FormControl(this.deals ? this.deals.description : null),
      startTime: new FormControl(this.deals ? new Date(this.deals.startTime) : startTime),
      endTime: new FormControl(this.deals? new Date(this.deals.endTime) : startTime)
    });

    this.populateItems();
  }

       /**
   * Destroy life cycle of the component.
   */
  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }

  setImageValidator() {
    if (this.deals && !this.deals.deal_image) {
      return [Validators.required];
    }
  }

  fileChangeEvent(fileInput: any) {
    this.imageFile = fileInput.target.files[0];
    this.dealImageChanged = true;
  }

  chooseFile() {
    this.dealImage.nativeElement.click();
  }

  populateItems() {
    this.itemLoading = true;
    this.franchiseItemsService
      .getItems(this.dataService.franchiseId)
      .pipe(finalize(() => this.itemLoading = false), takeUntil(this.destroy))
      .subscribe(itemresponseData => {
        this.items   = itemresponseData.data;
        this.setItemsList();
      });
  }

  setItemsList() {
    if (this.deals && this.deals.items.length) {
      this.itemsList = [];
      this.itemsList = this.deals.items;
      this.itemsList.push({quantity: 1, editing: true});
    }
  }

  onDealSubmit(btn: IsButton) {
    btn.startLoading()
    this.mapDealItems();
    this.isSubmitted = true;

    if (this.dealForm.valid) {
      if (!this.dealImageChanged) {
        let deal = this.dealForm.value;

        this.newDeal = {
          name: deal.name,
          price: deal.price,
          deal_image: this.deals.deal_image,
          end_date: null,
          franchise_id: this.dataService.franchiseId,
          subtitle: deal.subtitle,              
          description: deal.description,
          items: this.dealItemsList,
          startTime: deal.startTime,
          endTime: deal.endTime
        };
        this.isActiveModal.close({
          deal: this.newDeal,
          mode: this.isActiveModal.data.mode,
          imageDeleted: false
         });
         
         return ;
      }
      // btn.startLoading();
      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const filePath = 'deals/' + randomString + '-' + this.imageFile.name;
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
                end_date: null,
                franchise_id: this.dataService.franchiseId,
                subtitle: deal.subtitle,              
                description: deal.description,
                items: this.dealItemsList,
                startTime: deal.startTime,
                endTime: deal.endTime
              };
              this.isActiveModal.close({
               deal: this.newDeal,
               mode: this.isActiveModal.data.mode,
               imageDeleted: true
              });
            });
          })
        )
        .subscribe();
    }
  }

  mapDealItems() {
    this.dealItemsList = this.itemsList.filter(i => !i.editing).map(data => {
      if (data.item) {
        return {
          id: data.item.id,
          quantity: data.quantity
        }
      }
    })
  }

  onSave(row: ItemsList, index: number) {
    if (!row.item) {
      this.showItemError = true;
      return;
    } else  {
      this.showItemError = false;
    }

    if (!row.quantity) {
      this.showQuantityError = true;
      return;
    } else  {
      this.showQuantityError = false;
    }
   // this.dealItemsList.push({id: row.item.id, quantity: row.quantity});
    row.editing = false;
    const lastItem = this.itemsList[this.itemsList.length - 1];
    if (!lastItem.editing ) {
      this.itemsList.push({quantity: 1, editing: true});
    }
  }

  onEiditing(row: ItemsList) {
    row.editing = true;
  }

  onRemove(index: number) {
    this.itemsList.splice(index, 1);
  }
}
