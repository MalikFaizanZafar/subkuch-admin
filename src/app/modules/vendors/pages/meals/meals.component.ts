import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseItemsService } from "../../services/franchiseItems.service";
import { itemModel } from "../../models/itemModel";
import { IsModalService, IsModalSize } from "../../../../lib";
import { IsToasterService } from "../../../../lib/toaster";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { AddCategoryDialogComponent } from "../../components/add-category-dialog/add-category-dialog.component";
import { AddMealDialogBoxComponent } from "../../components/add-meal-dialog-box/add-meal-dialog-box.component";
import { EditMealDialogBoxComponent } from "../../components/edit-meal-dialog-box/edit-meal-dialog-box.component";

@Component({
  selector: "meals",
  templateUrl: "./meals.component.html",
  styleUrls: ["./meals.component.scss"]
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
  itemUrl: String = "";
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

  get franchiseId() {
    return Number(localStorage.getItem("franchiseId"));
  }

  constructor(
    private franchiseItemsService: FranchiseItemsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage
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
      let newCategory = {
        name: res.categoryName,
        type: "Type",
        franchise_id: Number(localStorage.getItem("franchiseId"))
      };
      this.franchiseItemsService
        .addCategory(newCategory)
        .subscribe(categoryResponse => {
          this.categories.push(categoryResponse.data);
        });
    });
  }
  onAddMealHandler() {
    this.addMealCancelled = false;
    let addMealDialog = this.isModal.open(AddMealDialogBoxComponent, {
      size: IsModalSize.Large,
      data: {
        categories: this.categories
      }
    });
    addMealDialog.onClose.subscribe(res => {
      if (res === "cancel") {
        console.log("Add Meal Cancelled");
        this.addMealCancelled = true;
      } else if (res === 0) {
        this.addMealCancelled = true;
      } else if (!this.addMealCancelled === false) {
        console.log("Add Meal Not Cancelled");
        this.franchiseItemsService.addItem(res).subscribe(addMealResponse => {
          this.meals.push(addMealResponse.data);
          this.toaster.popSuccess("Meal Has Been Deleted Successfully");
        });
      }
    });
  }
  onEditItemHandler(id) {
    this.editMealCancelled = false;
    let filterdItems = this.meals.filter(meal => meal.id == id);
    this.editMeal = filterdItems[0];
    const editMealDialog = this.isModal.open(EditMealDialogBoxComponent, {
      size: IsModalSize.Large,
      data: {
        categories: this.categories,
        editMeal: this.editMeal
      }
    });
    editMealDialog.onClose.subscribe(res => {
      if (res === "cancel") {
        this.editMealCancelled = true;
      } else if (res === 0) {
        this.editMealCancelled = true;
      } else if (!this.editMealCancelled) {
        this.franchiseItemsService
          .editItem(res, Number(this.editMeal.id))
          .subscribe(editMealResponseData => {
            this.newItem = editMealResponseData.data;
            const editMealIndex = this.meals
              .map(meal => meal.id)
              .indexOf(this.editMeal.id);
            this.toaster.popSuccess("Meal Has Been Edited Successfully");
            this.meals[editMealIndex] = this.newItem;
          });
      }
    });
  }

  onDeleteItemHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: "Are Your Sure you want to Delete this Meal ?"
    });
    deleteModal.onClose.subscribe(res => {
      if (res === "ok") {
        let delMeal = this.meals.filter(deal => deal.id == id);
        this.deleteMeal = delMeal[0];
        const delFile = this.storage.storage.refFromURL(
          this.deleteMeal.image_url
        );
        delFile.delete().then(deletedFile => {
          this.franchiseItemsService.deleteItem(id).subscribe(response => {
            this.toaster.popSuccess("Meal Has Been Deleted Successfully");
            this.meals = this.meals.filter(deal => deal.id != id);
          });
        });
      }
    });
  }
  onDeleteCategoryHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: "Are Your Sure you want to Delete this Category ?"
    });
    deleteModal.onClose.subscribe(res => {
      if (res === "ok") {
        this.franchiseItemsService.deleteCategory(id).subscribe(response => {
          this.toaster.popSuccess("Category Has Been Deleted Successfully");
          this.categories = this.categories.filter(
            categories => categories.id != id
          );
        });
      }
    });
  }
}
