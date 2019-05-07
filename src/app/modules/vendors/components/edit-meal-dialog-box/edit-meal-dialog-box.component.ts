import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IsModalService, IsActiveModal, IsButton } from 'app/lib';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'edit-meal-dialog-box',
  templateUrl: './edit-meal-dialog-box.component.html',
  styleUrls: ['./edit-meal-dialog-box.component.scss']
})
export class EditMealDialogBoxComponent implements OnInit {
  eMealForm: FormGroup;
  editMeal;
  categories = [];
  tempEditMealImageFile;
  editImageFile;
  downloadURL: Observable<string>;
  newMeal;
  mealImageFileChanged: boolean = false;
  @ViewChild('editMealImageInput') editMealImageInput: ElementRef;

  constructor(
    private isActiveModel: IsActiveModal,
    private storage: AngularFireStorage,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.mealImageFileChanged = false;
    this.editMeal = this.isActiveModel.data.editMeal;
    this.categories = this.isActiveModel.data.categories;
    this.tempEditMealImageFile = this.isActiveModel.data.editMeal.image_url;
    const dateObj = this.editMeal.endDate.split('T')[0];
    this.eMealForm = new FormGroup({
      title: new FormControl(this.editMeal.name, [Validators.required]),
      isAvailable: new FormControl(this.editMeal.isAvailable || false),
      category: new FormControl(this.editMeal.category, [Validators.required]),
      price: new FormControl(this.editMeal.price, [Validators.required]),
      isProduct: new FormControl(this.editMeal.isProduct || false),
      quantity: new FormControl(this.editMeal.quantity),
      discount: new FormControl(this.editMeal.discount, [Validators.required]),
      discountEnd: new FormControl(dateObj, [Validators.required]),
      description: new FormControl(this.editMeal.description),
      attachment: new FormControl(null)
    });
  }

  fileChangeEvent(fileInput: any) {
    let self = this;
    this.editImageFile = fileInput.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.tempEditMealImageFile = dataURL;
    };
    reader.readAsDataURL(fileInput.target.files[0]);
    this.mealImageFileChanged = true;
  }
  chooseFile() {
    this.editMealImageInput.nativeElement.click();
  }
  onMealSubmit(btn: IsButton) {
    if (this.eMealForm.valid) {
      if (this.mealImageFileChanged) {
        btn.startLoading();
        let randomString =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        const filePath =
          'items/' + randomString + '-' + this.editImageFile.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.editImageFile);
        const self = this;
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                let item = this.eMealForm.value;
                this.newMeal = {
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
                  franchise_id: this.dataService.franchiseId
                };
                btn.stopLoading();
                let deleteImageUrl = this.editMeal.image_url;
                this.storage.storage.refFromURL(deleteImageUrl).delete();
                this.isActiveModel.close(this.newMeal);
              });
            })
          )
          .subscribe();
      } else {
        btn.startLoading();
        let item = this.eMealForm.value;
        this.newMeal = {
          name: item.title,
          description: item.description,
          price: item.price,
          image_url: this.editMeal.image_url,
          discount: item.discount,
          discount_end_date: item.discountEnd,
          available: item.isAvailable,
          product: item.isProduct,
          quanity: item.quantity,
          category_id: Number(item.category),
          franchise_id: this.dataService.franchiseId
        };
        this.isActiveModel.close(this.newMeal);
        btn.stopLoading();
      }
    } else {
      return;
    }
  }
}
