import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseItemsService } from "../../services/franchiseItems.service";
import { itemModel } from "../../models/itemModel";
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';

@Component({
  selector: "meals",
  templateUrl: "./meals.component.html",
  styleUrls: ["./meals.component.scss"]
})
export class MealsComponent implements OnInit {
  categories = [
    {
      name: "Pizza",
      quantity: 11
    },
    {
      name: "Burgers",
      quantity: 8
    },
    {
      name: "Chicken",
      quantity: 4
    },
    {
      name: "Mutton",
      quantity: 3
    },
    {
      name: "Vegetables",
      quantity: 5
    }
  ];
  meals: any = [];
  showMeals: boolean = true;
  itemForm: FormGroup;
  eitemForm: FormGroup;
  newItem: itemModel;
  editMeal: {};
  showEditMeal: boolean = false;
  itemUrl: String = '';
  downloadURL: Observable<string>;
  imageFile;
  @ViewChild("itemImage") itemImage: ElementRef;
  constructor(private franchiseItemsService: FranchiseItemsService, private storage: AngularFireStorage) {}

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
    this.franchiseItemsService.getItems(50).subscribe(responseData => {
      this.meals = responseData.data;
    });
  }

  onEditItemHandler(id) {
    let filterdItems = this.meals.filter(meal => meal.id == id)
    this.editMeal = filterdItems[0]
    this.showEditMeal = true
    this.showMeals = false
    console.log("Edit Meal is : ", this.editMeal)
  }

  onItemSubmit(form: FormGroup) {
    let randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const filePath = "items/"+randomString+"-"+this.imageFile.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.imageFile);
    
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL()
        this.downloadURL.subscribe(url => {
          if (this.itemForm.valid) {
            let item = this.itemForm.value;
            this.newItem = {
              name: item.title,
              description: item.description,
              price: item.price,
              image_url : url,
              discount: item.discount,
              discount_end_date: item.discountEnd,
              available: item.isAvailable,
              product: item.isProduct,
              quanity: item.quantity,
              category_id: Number(item.category),
              franchise_id: 1,
            };
            this.franchiseItemsService
              .addItem(this.newItem)
              .subscribe(responseData => {
                this.newItem = responseData.data;
                this.showMeals = true
                console.log('this.newItem : ', this.newItem)
                this.itemForm.reset()
              });
          } else {
            return;
          }
        })
      } )
   ).subscribe()
  }
  onEItemSubmit(form: FormGroup, mealId : any) {
    let randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const filePath = "items/"+randomString+"-"+this.imageFile.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.imageFile);
    
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL()
        this.downloadURL.subscribe(url => {
          if (this.itemForm.valid) {
            let item = this.itemForm.value;
            this.newItem = {
              name: item.title,
              description: item.description,
              price: item.price,
              image_url : url,
              discount: item.discount,
              discount_end_date: item.discountEnd,
              available: item.isAvailable,
              product: item.isProduct,
              quanity: item.quantity,
              category_id: Number(item.category),
              franchise_id: 1,
            };
            this.franchiseItemsService
              .editItem(this.newItem, mealId)
              .subscribe(responseData => {
                this.newItem = responseData.data;
                this.showEditMeal = false
                this.showMeals = true
                console.log('this.newItem : ', this.newItem)
                this.itemForm.reset()
              });
          } else {
            return;
          }
        })
      } )
   ).subscribe()
  }
  fileChangeEvent(fileInput : any) {
    this.imageFile = fileInput.target.files[0];
  }
  chooseFile() {
    console.log("choose an image");
    this.itemImage.nativeElement.click();
  }
}
