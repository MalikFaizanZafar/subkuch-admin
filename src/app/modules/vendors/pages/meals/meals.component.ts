import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseItemsService } from "../../services/franchiseItems.service";
import { itemModel } from "../../models/itemModel";

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
  newItem : itemModel;
  @ViewChild("itemImage") itemImage: ElementRef;
  constructor(private franchiseItemsService: FranchiseItemsService) {}

  async ngOnInit() {
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
      // attachment: new FormControl(null, [Validators.required])
    });
    await this.franchiseItemsService.getItems(50).subscribe(responseData => {
      this.meals = responseData.data;
    });
  }

  onItemSubmit(form: FormGroup) {
    console.log("this.itemForm.valid has : ", this.itemForm.valid);
    if (this.itemForm.valid) {
      let item = this.itemForm.value;
      this.newItem = {
        name : item.title,
        description: item.description,
        price : item.price,
        discount: item.discount,
        discount_end_date : item.discountEnd,
        available : item.isAvailable,
        product : item.isProduct,
        quanity : item.quantity,
        category_id : Number(item.category),
        franchise_id : 1
      }
      console.log("this.newItem has : ", this.newItem);
      this.franchiseItemsService.addItem(this.newItem).subscribe(responseData => {
        console.log("responseData has : ", responseData);
        this.newItem = responseData.data
        // console.log("this.newItem : ", this.newItem);
      })
    } else {
      return;
    }
  }
  chooseFile() {
    console.log("choose an image");
    this.itemImage.nativeElement.click();
  }
}
