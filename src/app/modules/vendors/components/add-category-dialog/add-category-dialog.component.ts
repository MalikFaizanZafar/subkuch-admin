import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsActiveModal } from 'app/lib';
@Component({
  selector: 'add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  categories = []
  constructor( private isActiveModal : IsActiveModal) {
    this.categoryForm = new FormGroup({
      categoryName: new FormControl(null, [Validators.required])
    });
   }

  ngOnInit() {
  }
  onAddCategory() {
    if(this.categoryForm.valid) {
      this.isActiveModal.close(this.categoryForm.value)
    }else {
      console.log("Form is invalid")
    }
  }
}
