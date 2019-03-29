import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
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
  @ViewChild('itemImage') itemImage : ElementRef;
  constructor(private franchiseItemsService: FranchiseItemsService) {}

  async ngOnInit() {
    await this.franchiseItemsService.getItems(50).subscribe(responseData => {
      this.meals = responseData.data;
    });
  }

  chooseFile(){
    this.itemImage.nativeElement.click()
  }
}
