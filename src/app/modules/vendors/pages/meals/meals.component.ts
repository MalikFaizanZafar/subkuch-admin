import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit {
  categories = [{
    name: 'Pizza',
    quantity: 11
  },
  {
    name: 'Burgers',
    quantity: 8
  },
  {
    name: 'Chicken',
    quantity: 4
  },
  {
    name: 'Mutton',
    quantity: 3
  },
  {
    name: 'Vegetables',
    quantity: 5
  }]
  constructor() { }

  ngOnInit() {
  }

}
