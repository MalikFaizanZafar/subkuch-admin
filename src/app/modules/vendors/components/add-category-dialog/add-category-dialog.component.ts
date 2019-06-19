import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IsActiveModal, IsButton } from 'app/lib';

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

  onAddCategory(btn: IsButton) {
    if(this.categoryForm.valid) {
      btn.startLoading()
      this.isActiveModal.close(this.categoryForm.value)
    }
  }

  close() {
    this.isActiveModal.close();
  }
}
