import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  TemplateRef
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { FranchiseItemsService } from "../../services/franchiseItems.service";
import { itemModel } from "../../models/itemModel";
import { IsButton, IsModalService } from "../../../../lib";
import { IsToasterService } from "../../../../lib/toaster";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

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
  @ViewChild("itemImage") itemImage: ElementRef;
  constructor(
    private franchiseItemsService: FranchiseItemsService,
    private isModal: IsModalService,
    private toaster: IsToasterService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.itemForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      isAvailable: new FormControl(null),
      category: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      isProduct: new FormControl(null, [Validators.requiredTrue]),
      quantity: new FormControl(null, [Validators.required]),
      discount: new FormControl(null, [Validators.required]),
      discountEnd: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      attachment: new FormControl(null, [Validators.required])
    });
    this.categoryForm = new FormGroup({
      categoryName: new FormControl(null, [Validators.required])
    });
    this.franchiseItemsService
      .getCategories(Number(localStorage.getItem("franchiseId")))
      .subscribe(responseData => {
        this.categories = responseData.data;
        this.franchiseItemsService
          .getItems(Number(localStorage.getItem("franchiseId")))
          .subscribe(itemresponseData => {
            this.meals = itemresponseData.data;
            console.log("this.meals has : ", this.meals);
          });
      });
  }
  getCategoryItems(name: string) {
    this.franchiseItemsService
      .getCategoriesByName(name)
      .subscribe(nameCategories => {
        console.log("nameCategories : ", nameCategories);
      });
  }
  addCategoryHandler(addCategoryDialog: TemplateRef<any>) {
    const addCategoryDlg = this.isModal.open(addCategoryDialog);
    if (this.categoryForm.valid) {
      console.log("valid form ", this.categoryForm.value);
      addCategoryDlg.onClose.subscribe(res => {
        if (res === "save") {
          this.onAddCategory();
        } else {
          console.log("Form not Valid");
        }
      });
    }
  }
  onAddCategory() {
    if (this.categoryForm.valid) {
      let category = this.categoryForm.value;
      let newCategory = {
        name: category.categoryName,
        type: "Type",
        franchise_id: Number(localStorage.getItem("franchiseId"))
      };
      this.franchiseItemsService
        .addCategory(newCategory)
        .subscribe(categoryResponse => {
          console.log("newCat is : ", categoryResponse.data);
          this.categories.push(categoryResponse.data);
          this.categoryForm.reset();
        });
    }
  }
  onEditItemHandler(id) {
    let filterdItems = this.meals.filter(meal => meal.id == id);
    this.editMeal = filterdItems[0];
    this.showEditMeal = true;
    this.showMeals = false;
    console.log("Edit Meal is : ", this.editMeal);
    this.tempMealImageFile = this.editMeal.image_url;
    this.eitemForm = new FormGroup({
      etitle: new FormControl(null, [Validators.required]),
      eisAvailable: new FormControl(null),
      ecategory: new FormControl(null, [Validators.required]),
      eprice: new FormControl(null, [Validators.required]),
      eisProduct: new FormControl(null, [Validators.requiredTrue]),
      equantity: new FormControl(null, [Validators.required]),
      ediscount: new FormControl(null, [Validators.required]),
      ediscountEnd: new FormControl(null, [Validators.required]),
      edescription: new FormControl(null, [Validators.required]),
      eattachment: new FormControl(null, [Validators.required])
    });
  }

  onDeleteItemHandler(id, deleteDialog: TemplateRef<any>) {
    const deleteModal = this.isModal.open(deleteDialog, {
      data: "Are Your Sure you want to Delete this Meal ?"
    });
    deleteModal.onClose.subscribe(res => {
      console.log("modal res has : ", res);
      if (res === "ok") {
        let delMeal = this.meals.filter(deal => deal.id == id);
        this.deleteMeal = delMeal[0];
        const delFile = this.storage.storage.refFromURL(
          this.deleteMeal.image_url
        );
        delFile.delete().then(deletedFile => {
          this.franchiseItemsService.deleteItem(id).subscribe(response => {
            console.log("Response from Server : ", response);
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
      console.log("modal res has : ", res);
      if( res === 'ok') {
        console.log(' category delete id : ', id)
        this.franchiseItemsService.deleteCategory(id).subscribe(response => {
          console.log("Response from Server : ", response);
          this.toaster.popSuccess("Category Has Been Deleted Successfully");
          this.categories = this.categories.filter(categories => categories.id != id);
        });
      }
    });
  }
  onItemSubmit(form: FormGroup, btn: IsButton) {
    // console.log('url is : ', url)
    if (this.itemForm.valid) {
      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const filePath = "items/" + randomString + "-" + this.imageFile.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.imageFile);
      btn.startLoading();
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              let item = this.itemForm.value;
              this.newItem = {
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
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              console.log("this.newItem is : ", this.newItem);
              this.franchiseItemsService
                .addItem(this.newItem)
                .subscribe(responseData => {
                  this.newItem = responseData.data;
                  this.showMeals = true;
                  this.meals.push(this.newItem);
                  console.log("this.newItem : ", this.newItem);
                  btn.stopLoading();
                  this.itemForm.reset();
                });
            });
          })
        )
        .subscribe();
    } else {
      console.log("Form is not Valid");
    }
  }
  onEItemSubmit(form: FormGroup) {
    if (this.eitemForm.valid) {
      let randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const filePath = "items/" + randomString + "-" + this.imageFile.name;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.imageFile);
      const self = this;
      console.log("eitemForm is ", self.eitemForm.value);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              let item = this.eitemForm.value;
              this.newItem = {
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
                franchise_id: Number(localStorage.getItem("franchiseId"))
              };
              this.franchiseItemsService
                .editItem(this.newItem, self.editMeal.id)
                .subscribe(responseData => {
                  this.newItem = responseData.data;
                  this.showEditMeal = false;
                  this.showMeals = true;
                  this.storage.storage
                    .refFromURL(this.editMeal.image_url)
                    .delete();
                  console.log("this.newItem : ", this.newItem);
                  this.eitemForm.reset();
                });
            });
          })
        )
        .subscribe();
    } else {
      return;
    }
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
    console.log("choose an image");
    this.itemImage.nativeElement.click();
  }
  getFormattedDate(mealDate: Date) {
    const dateObj = new Date(mealDate);
    return `${dateObj.getMonth()}/${dateObj.getDay()}/${dateObj.getFullYear()}`;
  }
}
