import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FranchiseItemsService } from "../../services/franchiseItems.service";

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
  showMeals: boolean  = true;
  itemForm: FormGroup;
  @ViewChild('itemImage') itemImage : ElementRef;
  constructor(private franchiseItemsService: FranchiseItemsService) {}

  async ngOnInit() {
    this.itemForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      attachment: new FormControl(null, [Validators.required])
    });
    await this.franchiseItemsService.getItems(50).subscribe(responseData => {
      this.meals = responseData.data;
    });
  }

  onItemSubmit(form: FormGroup) {
    console.log('form has : ', this.itemForm.value)
    if (this.itemForm.valid) {
      let item = this.itemForm.value;
    } else {
      return;
    }
  }
  chooseFile(){
    console.log('choose an image')
    this.itemImage.nativeElement.click()
  }
}
