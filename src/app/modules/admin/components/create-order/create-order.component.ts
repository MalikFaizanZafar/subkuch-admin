import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { FranchiseOrdersService } from '../../services/franchiseOrders.service';
import { finalize } from 'rxjs/operators';
import { FranchiseItemsService } from '../../services/franchiseItems.service';
import { DataService } from '@app/shared/services/data.service';
import { FranchiseDealsService } from '../../services/franchiseDeals.service';
import { forkJoin } from 'rxjs';
import { IsButton, IsActiveModal } from 'app/lib';
import { OrderItems, OrderRequest } from '../../models/order';
import { IsToasterService, IsToastPosition } from 'app/lib/toaster';

interface ItemsList {
  quantity?: number;
  name?: any;
  id?: number;
  editing?: boolean;
  type?: number;
}

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateOrderComponent implements OnInit {
  userVarificationTypes: any[] = [
    {id: 1, type: 'username', value: 'Username'},
    {id: 2, type:'contact', value:'Contact No.'},
    {id: 3, type: 'email', value:'Email Id'}
  ];
  inputLabel: string;
  selectedType: any = 3;
  verificationInput: string;
  loading = false;
  isUserVerified: boolean = false;
  itemTypes: any[] =  [
    {id: 1, value: 'Item'},
    {id: 2, value: 'Deal'}
  ];
  itemsList: ItemsList[] = [];
  franchiseId: number;
  meals: any[] = [];
  deals: any[] = [];
  mealsData: OrderItems[] = [];
  dealsData: OrderItems[] = [];
  userId: number;
  manualEntry: boolean = true;
  orderNumber: string;
  price: number = 0;
  orderId: number;

  constructor(
    private orderService: FranchiseOrdersService,
    private itemsService: FranchiseItemsService,
    private dataService: DataService,
    private franchiseDealsService: FranchiseDealsService,
    private activeModal: IsActiveModal,
    private toast: IsToasterService
    ) { }

  ngOnInit() {
    this.franchiseId = this.dataService.franchiseId;
    if (this.activeModal.data) {
      const data = this.activeModal.data;
      this.orderId = data.id;
      this.isUserVerified = true;
      if (data.detail.length > 0) {
        debugger
        this.manualEntry = false
        this.populateItems();
        this.mapItemsList(data.detail);
      } else  {
        this.manualEntry = true;
        this.price = data.total;
        this.orderNumber = data.orderNumber;
      }
    } 
    this.itemsList.push({type: 1, editing: true, quantity: 1 });
  }

  mapItemsList(detail: any[]) {
    detail.map(d => {
      if(d.item) {
        this.itemsList.push({id: d.item.id, quantity: d.quantity, type: 1, name: d.item.name})
      } else if (d.deal) {
        this.itemsList.push({id: d.deal.id, quantity: d.quantity, type: 2, name: d.deal.name})
      }
    });
  }

  onSelectionChange() {
    this.inputLabel = this.userVarificationTypes.find(item => item.id === this.selectedType).value;
  }

  populateItems() {
    this.loading = true;
    forkJoin(
    this.itemsService.getItems(this.franchiseId),
    this.franchiseDealsService.getDeals(this.franchiseId)
    ).pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        if (res) {
          this.meals = res[0].data;
          this.deals = res[1].data;
        }
      });
  }

  verifyIfUserExist(btn: IsButton) {
    btn.startLoading();
    const type = this.userVarificationTypes.find(item => item.id === this.selectedType).type;
    this.orderService.verifyUser(this.verificationInput, type).pipe(finalize(() => btn.stopLoading())).subscribe(res => {
      if (res && res.statusCode === 200) {
        this.isUserVerified = true;
        this.userId = res.data.userId;
        this.populateItems();
      }
    });
  }

  onSave(row: ItemsList) {
    row.editing = false;
    this.setItemName(row);
    if (!this.itemsList[this.itemsList.length -1].editing )  {
      this.itemsList.push({type: 1, editing: true, quantity: 1 });
    }
  }

  generateItemsList() {
    this.itemsList.map(row  =>  {
      if (row.id) {
        if (row.type === 1) {
          this.mealsData.push({id: row.id, quantity: row.quantity});
        } else {
          this.dealsData.push({id: row.id, quantity: row.quantity});
        }
      }
    });
  }


  getItemTypes(row: ItemsList) {
    const item = this.itemTypes.find(item => item.id === row.type);
    return item.value;
  }

  setItemName(row: ItemsList) {
    let item;
    if (row.type === 1) {
      item = this.meals.find(item => item.id === row.id).name;
    } else {
      item = this.deals.find(item => item.id === row.id).name;
    }
    row.name = item;
  }
  
  onEiditing(row: ItemsList) {
    row.editing = true;
  }

  onRemove(index: number) {
    this.itemsList.splice(index, 1);
  }

  onSubmit(btn: IsButton) {
    btn.startLoading();
    this.generateItemsList();
    const data: OrderRequest = {
      acknowledged: true,
      delivery: false,
      franchiseId: this.franchiseId,
      userId: this.userId,
      orderTotal: this.price,
      orderNumber: this.orderNumber,
      location: 'Dining'
    };

    if (!this.manualEntry) {
      data.items =  this.mealsData;
      data.deals = this.dealsData;
      data.orderNumber = null;
      data.orderTotal = 0;      
    }

    if (this.orderId) {
      this.orderService.updateOrder(data, this.orderId).pipe(finalize(() => btn.stopLoading())).subscribe(res => {
        if (res) {
          this.toast.popSuccess('Order Create Successfully', {
            position: IsToastPosition.BottomRight
          });
          this.activeModal.close();
        }
      });
    } else {
      this.orderService.createOrder(data).pipe(finalize(() => btn.stopLoading())).subscribe(res => {
        if (res) {
          this.toast.popSuccess('Order Create Successfully', {
            position: IsToastPosition.BottomRight
          });
          this.activeModal.close();
        }
      });
    }
  }
}
