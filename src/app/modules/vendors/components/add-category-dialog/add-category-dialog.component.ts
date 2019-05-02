import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsActiveModal } from 'app/lib';

@Component({
  selector: 'add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent {
  categoryForm: FormGroup;
  categories = []

  constructor( private isActiveModal : IsActiveModal) {
    this.categoryForm = new FormGroup({
      categoryName: new FormControl(null, [Validators.required])
    });
   }

  onAddCategory() {
    if(this.categoryForm.valid) {
      this.isActiveModal.close(this.categoryForm.value)
    }
  }

  close() {
    this.isActiveModal.close();
  }
}
