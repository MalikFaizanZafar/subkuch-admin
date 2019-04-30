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
import { IsButton, IsModalService, IsModalSize } from "../../../../lib";
import { IsToasterService } from "../../../../lib/toaster";
import { AngularFireStorage } from "@angular/fire/storage";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { AddCategoryDialogComponent } from "../../components/add-category-dialog/add-category-dialog.component";
import { AddMealDialogBoxComponent } from "../../components/add-meal-dialog-box/add-meal-dialog-box.component";

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
  @ViewChild("eitemImage") eitemImage: ElementRef;
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
          .getItems(this.franchiseId,this.selectedCategory )
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
    let addCategoryDialogOpenRef = this.isModal.open(AddCategoryDialogComponent);
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
    })
  }
  onAddMealHandler(){
    this.addMealCancelled = false;
    let addMealDialog = this.isModal.open(AddMealDialogBoxComponent, {
      size: IsModalSize.Large,
      data: {
        categories: this.categories
      }
    });
    addMealDialog.onClose.subscribe(res => {
      if( res === 'cancel'){
        console.log("Add Meal Cancelled")
        this.addMealCancelled = true
      }
      else if(!this.addMealCancelled === false) {
        console.log("Add Meal Not Cancelled")
        this.franchiseItemsService.addItem(res).subscribe(addMealResponse => {
          this.meals.push(addMealResponse.data)
        })
      }
    })
  }
  onEditItemHandler(id) {
    let filterdItems = this.meals.filter(meal => meal.id == id);
    this.editMeal = filterdItems[0];
    this.showEditMeal = true;
    this.showMeals = false;
    const dateObj = this.editMeal.endDate.split("T")[0];
    this.tempMealImageFile = this.editMeal.image_url;
    console.log(this.editMeal.isProduct);
    this.eitemForm = new FormGroup({
      etitle: new FormControl(this.editMeal.name, [Validators.required]),
      eisAvailable: new FormControl(this.editMeal.isAvailable || false),
      ecategory: new FormControl(this.editMeal.category, [Validators.required]),
      eprice: new FormControl(this.editMeal.price, [Validators.required]),
      eisProduct: new FormControl(this.editMeal.isProduct || false),
      equantity: new FormControl(this.editMeal.quantity),
      ediscount: new FormControl(this.editMeal.discount, [Validators.required]),
      ediscountEnd: new FormControl(dateObj, [Validators.required]),
      edescription: new FormControl(this.editMeal.description),
      eattachment: new FormControl(null)
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
      if (res === "ok") {
        console.log(" category delete id : ", id);
        this.franchiseItemsService.deleteCategory(id).subscribe(response => {
          console.log("Response from Server : ", response);
          this.toaster.popSuccess("Category Has Been Deleted Successfully");
          this.categories = this.categories.filter(
            categories => categories.id != id
          );
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
  onEItemSubmit(form: FormGroup, btn: IsButton) {
    console.log("this.etemForm is : ", this.eitemForm.value);
    if (this.eitemForm.valid) {
      if (this.imageFileEdited) {
        console.log('imageFile Edited : ', true)
        btn.startLoading();
        let randomString =
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15);
        const filePath = "items/" + randomString + "-" + this.eimageFile.name;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(filePath, this.eimageFile);
        const self = this;
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                let item = this.eitemForm.value;
                let enewItem = {
                  name: item.etitle,
                  description: item.edescription,
                  price: item.eprice,
                  image_url: url,
                  discount: item.ediscount,
                  discount_end_date: item.ediscountEnd,
                  available: item.eisAvailable,
                  product: item.eisProduct,
                  quanity: item.equantity,
                  category_id: Number(item.ecategory),
                  franchise_id: Number(localStorage.getItem("franchiseId"))
                };
                this.franchiseItemsService
                  .editItem(enewItem, self.editMeal.id)
                  .subscribe(responseData => {
                    this.newItem = responseData.data;
                    this.showEditMeal = false;
                    this.showMeals = true;
                    const editMealIndex = this.meals.map(meal => meal.id).indexOf(self.editMeal.id)
                    this.meals[editMealIndex] = this.newItem
                    let deleteImageUrl = this.editMeal.image_url
                    this.storage.storage
                      .refFromURL(deleteImageUrl)
                      .delete();
                    btn.stopLoading();
                    this.toaster.popSuccess(
                      "Meal has been Edited Successfully"
                    );
                    this.imageFileEdited = false;
                    this.eitemForm.reset();
                  });
              });
            })
          )
          .subscribe();
      } else {
        console.log('imageFile Edited : ', false)
        btn.startLoading();
        let item = this.eitemForm.value;
        let enewItem = {
          name: item.etitle,
          description: item.edescription,
          price: item.eprice,
          image_url: this.editMeal.image_url,
          discount: item.ediscount,
          discount_end_date: item.ediscountEnd,
          available: item.eisAvailable,
          product: item.eisProduct,
          quanity: item.equantity,
          category_id: Number(item.ecategory),
          franchise_id: Number(localStorage.getItem("franchiseId"))
        };
        console.log("enewItem is ", enewItem);
        this.franchiseItemsService
          .editItem(enewItem, this.editMeal.id)
          .subscribe(responseData => {
            this.newItem = responseData.data;
            this.showEditMeal = false;
            this.showMeals = true;
            console.log("this.newItem : ", this.newItem);
            btn.stopLoading();
            const editMealIndex = this.meals.map(meal => meal.id).indexOf(this.editMeal.id)
            console.log("editMealIndex :", editMealIndex)
            this.meals[editMealIndex] = this.newItem
            console.log("this.meals[editMealIndex] is  :", this.meals[editMealIndex])
            this.toaster.popSuccess("Meal has been Edited Successfully");
            this.imageFileEdited = false;
            this.eitemForm.reset();
          });
      }
    } else {
      console.log("eItemForm is not valid");
      return;
    }
  }
  efileChangeEvent(fileInput: any) {
    let self = this;
    this.eimageFile = fileInput.target.files[0];
    console.log("this.eimageFile : ", this.eimageFile);
    var reader = new FileReader();
    reader.onload = function() {
      var dataURL = reader.result;
      self.etempMealImageFile = dataURL;
    };
    reader.readAsDataURL(fileInput.target.files[0]);
    this.imageFileEdited = true;
  }
  echooseFile() {
    this.eitemImage.nativeElement.click();
  }
}
