import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IsModalService, IsActiveModal, IsButton } from 'app/lib';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DataService } from '@app/shared/services/data.service';

@Component({
  selector: 'add-meal-dialog-box',
  templateUrl: './add-meal-dialog-box.component.html',
  styleUrls: ['./add-meal-dialog-box.component.scss']
})
export class AddMealDialogBoxComponent implements OnInit {
  mealForm: FormGroup;
  mealImage;
  tempMealImageFile;
  imageFile;
  downloadURL: Observable<string>;
  newMeal;
  categories = [];
  @ViewChild('mealImageInput') mealImageInput: ElementRef;

  constructor(
    private isActiveModel: IsActiveModal,
    private storage: AngularFireStorage,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.categories = this.isActiveModel.data.categories;
    this.mealForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      isAvailable: new FormControl(false),
      category: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      isProduct: new FormControl(false),
      quantity: new FormControl(null),
      discount: new FormControl(null, [Validators.required]),
      discountEnd: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      attachment: new FormControl(null, [Validators.required])
    });
  }

  fileChangeEvent(fileInput: any) {
    let self = this;
    this.imageFile = fileInput.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.tempMealImageFile = dataURL;
    };
    reader.readAsDataURL(fileInput.target.files[0]);
  }
  chooseFile() {
    this.mealImageInput.nativeElement.click();
  }

  onMealSubmit(btn: IsButton) {
    if (this.mealForm.valid) {
      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const filePath = 'items/' + randomString + '-' + this.imageFile.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.imageFile);
      btn.startLoading();
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              let item = this.mealForm.value;
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

              this.isActiveModel.close(this.newMeal);
            });
          })
        )
        .subscribe();
    }
  }
}
