import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FranchiseItemsService } from '../../services/franchiseItems.service';
import { itemModel } from '../../models/itemModel';
import { IsModalService, IsModalSize } from '../../../../lib';
import { IsToasterService, IsToastPosition } from '../../../../lib/toaster';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AddCategoryDialogComponent } from '../../components/add-category-dialog/add-category-dialog.component';
import { AddMealDialogBoxComponent } from '../../components/add-meal-dialog-box/add-meal-dialog-box.component';
import { EditMealDialogBoxComponent } from '../../components/edit-meal-dialog-box/edit-meal-dialog-box.component';
import { DataService } from '@app/shared/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss']
})
export class MealsComponent implements OnInit {
  categories = [];
  meals: any = [];
  showMeals: boolean = true;
  itemForm: FormGroup;
  categoryForm: FormGroup;
  eitemForm: FormGroup;
  newItem: itemModel;
  editMeal;
  deleteMeal;
  showEditMeal: boolean = false;
  itemUrl: String = '';
  downloadURL: Observable<string>;
  imageFile;
  tempMealImageFile;
  eimageFile;
  etempMealImageFile;
  imageFileEdited: boolean = false;
  addMealCancelled: boolean = false;
  editMealCancelled: boolean = false;
  selectedIndex: number = null;
  selectedCategory: number;
  loading = true;

  get franchiseId() {
    return this.dataService.franchiseId;
  }

  constructor(
    private franchiseItemsService: FranchiseItemsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryForm = new FormGroup({
      categoryName: new FormControl(null, [Validators.required])
    });

    this.franchiseItemsService
      .getCategories(this.franchiseId)
      .subscribe(responseData => {
        this.categories = responseData.data;
        this.populateItems();
      });
  }

  populateItems() {
    this.franchiseItemsService
      .getItems(this.franchiseId, this.selectedCategory)
      .subscribe(itemresponseData => {
        this.loading = false;
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { franchiseId: this.dataService.franchiseId }
        });
        this.meals = itemresponseData.data;
      });
  }

  getCategoryItems(id: number, index: number) {
    console.log(index);
    this.selectedIndex = index;
    this.selectedCategory = id;
    this.populateItems();
  }
  addCategoryHandler() {
    let addCategoryDialogOpenRef = this.isModal.open(
      AddCategoryDialogComponent
    );
    addCategoryDialogOpenRef.onClose.subscribe(res => {
      if (res) {
        let newCategory = {
          name: res.categoryName,
          type: 'Type',
          franchise_id: this.dataService.franchiseId
        };
        this.franchiseItemsService
          .addCategory(newCategory)
          .subscribe(categoryResponse => {
            this.categories.push(categoryResponse.data);
            this.toaster.popSuccess('Category Has Been Deleted Successfully', {
              position: IsToastPosition.BottomRight
            });
          });
      }
    });
  }
  onAddMealHandler() {
    this.addMealCancelled = false;
    let addMealDialog = this.isModal.open(AddMealDialogBoxComponent, {
      backdrop: 'static',
      data: {
        categories: this.categories
      }
    });
    addMealDialog.onClose.subscribe(res => {
      if (res !== 'cancel') {
        console.log('Add Meal Not Cancelled');
        this.franchiseItemsService.addItem(res).subscribe(addMealResponse => {
          this.meals.push(addMealResponse.data);
          this.toaster.popSuccess('Meal Has Been Deleted Successfully', {
            position: IsToastPosition.BottomRight
          });
        });
      }
    });
  }

  onEditItemHandler(id) {
    this.editMealCancelled = false;
    let filterdItems = this.meals.filter(meal => meal.id == id);
    this.editMeal = filterdItems[0];
    const editMealDialog = this.isModal.open(EditMealDialogBoxComponent, {
      backdrop: 'static',
      data: {
        categories: this.categories,
        editMeal: this.editMeal
      }
    });
    editMealDialog.onClose.subscribe(res => {
      if (res !== 'cancel') {
        this.franchiseItemsService
          .editItem(res, Number(this.editMeal.id))
          .subscribe(editMealResponseData => {
            this.newItem = editMealResponseData.data;
            const editMealIndex = this.meals
              .map(meal => meal.id)
              .indexOf(this.editMeal.id);
            this.toaster.popSuccess('Meal Has Been Edited Successfully', {
              position: IsToastPosition.BottomRight
            });
            this.meals[editMealIndex] = this.newItem;
          });
      }
    });
  }

  onDeleteItemHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: 'Are Your Sure you want to Delete this Meal ?'
    });
    deleteModal.onClose.subscribe(res => {
      if (res === 'ok') {
        let delMeal = this.meals.filter(deal => deal.id == id);
        this.deleteMeal = delMeal[0];
          this.franchiseItemsService.deleteItem(id).subscribe(response => {
            if (this.deleteMeal.image_url.includes("firebasestorage")) {
              console.log("Image is from Firestorage");
              this.storage.storage
                .refFromURL(this.deleteMeal.image_url)
                .getDownloadURL()
                .then(image => {
                  this.storage.storage.refFromURL(this.deleteMeal.image_url).delete();
                })
                .catch(error => console.log("error is : ", error));
            } else {
              console.log("Image is NOT from Firestorage");
            }
            this.toaster.popSuccess('Meal Has Been Deleted Successfully', {
              position: IsToastPosition.BottomRight
            });
            this.meals = this.meals.filter(deal => deal.id != id);
          });
      }
    });
  }
  onDeleteCategoryHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: 'Are Your Sure you want to Delete this Category ?'
    });
    deleteModal.onClose.subscribe(res => {
      if (res === 'ok') {
        this.franchiseItemsService.deleteCategory(id).subscribe(response => {
          this.toaster.popSuccess('Category Has Been Deleted Successfully', {
            position: IsToastPosition.BottomRight
          });
          this.categories = this.categories.filter(
            categories => categories.id != id
          );
        });
      }
    });
  }
}
