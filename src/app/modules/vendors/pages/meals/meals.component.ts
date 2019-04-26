import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseItemsService } from "../../services/franchiseItems.service";
import { itemModel } from "../../models/itemModel";
import { IsButton, IsModalService } from '../../../../lib';
import { IsToasterService } from '../../../../lib/toaster';
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { FranchiseInfoService } from "../../services/franchiseInfo.service";

@Component({
  selector: "meals",
  templateUrl: "./meals.component.html",
  styleUrls: ["./meals.component.scss"]
})
export class MealsComponent implements OnInit {
  categories = [];
  meals: any = [];
  showMeals: boolean = true;
  itemForm: FormGroup;
  eitemForm: FormGroup;
  newItem: itemModel;
  editMeal: {};
  deleteMeal;
  showEditMeal: boolean = false;
  itemUrl: String = "";
  downloadURL: Observable<string>;
  imageFile;
  @ViewChild("itemImage") itemImage: ElementRef;
  constructor(
    private franchiseInfoService : FranchiseInfoService,
    private franchiseItemsService: FranchiseItemsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.itemForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      isAvailable: new FormControl(1),
      category: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      isProduct: new FormControl(null, [Validators.requiredTrue]),
      quantity: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      discountEnd: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
    this.franchiseItemsService.getCategories().subscribe(responseData => {
      this.categories = responseData.data;
      this.franchiseItemsService.getItems(50).subscribe(itemresponseData => {
        this.meals = itemresponseData.data;
      });
    });
  }
  getCategoryItems( name : string){
    this.franchiseItemsService.getCategoriesByName(name).subscribe(nameCategories => {
      console.log('nameCategories : ', nameCategories)
    })
  }
  onEditItemHandler(id) {
    let filterdItems = this.meals.filter(meal => meal.id == id);
    this.editMeal = filterdItems[0];
    this.showEditMeal = true;
    this.showMeals = false;
    console.log("Edit Meal is : ", this.editMeal);
  }

  onDeleteItemHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {data: "Are Your Sure you want to Delete this Meal ?"})
    deleteModal.onClose.subscribe(res => {
      console.log('modal res has : ', res)
      if(res === 'ok') {
        let delMeal = this.meals.filter(deal => deal.id == id);
        this.deleteMeal = delMeal[0]
        const delFile = this.storage.storage.refFromURL(this.deleteMeal.image_url);
        delFile.delete().then(deletedFile => {
          this.franchiseItemsService.deleteItems(id).subscribe(response => {
          console.log("Response from Server : ", response);
          this.toaster.popSuccess('Meal Has Been Deleted Successfully !');
          this.meals = this.meals.filter(deal => deal.id != id);
        });
        })
      }
    })
  }
  onItemSubmit(form: FormGroup, btn : IsButton) {
    btn.startLoading()
    let randomString =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    const filePath = "items/" + randomString + "-" + this.imageFile.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.imageFile);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            // console.log('url is : ', url)
            if (this.itemForm.valid) {
              let item = this.itemForm.value;
              this.newItem = {
                name: item.title,
                description: item.description,
                price: item.price,
                image_url: url,
                discount: item.discount,
                discount_end_date: item.discountEnd,
                available: item.isAvailable,
                product: item.isProduct,
                quanity: item.quantity,
                category_id: Number(item.category),
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              console.log('this.newItem is : ', this.newItem)
              this.franchiseItemsService
                .addItem(this.newItem)
                .subscribe(responseData => {
                  this.newItem = responseData.data;
                  this.showMeals = true;
                  this.meals.push(this.newItem)
                  console.log("this.newItem : ", this.newItem);
                  btn.stopLoading()
                  this.itemForm.reset();
                });
            } else {
              return;
            }
          });
        })
      )
      .subscribe();
  }
  onEItemSubmit(form: FormGroup, mealId: any) {
    let randomString =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
    const filePath = "items/" + randomString + "-" + this.imageFile.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.imageFile);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (this.itemForm.valid) {
              let item = this.itemForm.value;
              this.newItem = {
                name: item.title,
                description: item.description,
                price: item.price,
                image_url: url,
                discount: item.discount,
                discount_end_date: item.discountEnd,
                available: item.isAvailable,
                product: item.isProduct,
                quanity: item.quantity,
                category_id: Number(item.category),
                franchise_id: 1
              };
              this.franchiseItemsService
                .editItem(this.newItem, mealId)
                .subscribe(responseData => {
                  this.newItem = responseData.data;
                  this.showEditMeal = false;
                  this.showMeals = true;
                  console.log("this.newItem : ", this.newItem);
                  this.itemForm.reset();
                });
            } else {
              return;
            }
          });
        })
      )
      .subscribe();
  }
  fileChangeEvent(fileInput: any) {
    this.imageFile = fileInput.target.files[0];
  }
  chooseFile() {
    console.log("choose an image");
    this.itemImage.nativeElement.click();
  }
}
