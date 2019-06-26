import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { GoogleMapService } from "@app/shared/services/google-map.service";
import { MapsAPILoader } from "@agm/core";
import { LocationCoordinates } from "@app/shared/models/coordinates";
import { IsButton, IsActiveModal } from 'app/lib';
import { FranchiseAccountService } from '../../services/franchiseAccount.service';

declare var google: any;
@Component({
  selector: 'add-franchise-dialog',
  templateUrl: './add-franchise-dialog.component.html',
  styleUrls: ['./add-franchise-dialog.component.scss']
})
export class AddFranchiseDialogComponent implements OnInit {
  @Input()
  data: any;
  signupForm: FormGroup;
  currentPostion: LocationCoordinates;
  currentAddress: string;
  brandId: Number;
  serviceId: Number;
  brandName: String;
  emailExists: boolean = false;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  constructor( private isActiveModal: IsActiveModal,private mapsApiLoader: MapsAPILoader,
    private googleMapService: GoogleMapService, private franchiseAccountService: FranchiseAccountService) { }

  ngOnInit() {
    this.brandId = this.isActiveModal.data.brandId
    this.brandName = this.isActiveModal.data.brandName
    this.serviceId = this.isActiveModal.data.service
    this.signupForm = new FormGroup({
      name : new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      contact: new FormControl(null, [
        Validators.required
      ])
    });
    this.mapsApiLoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"]
        }
      );

      this.registerEventListener(autocomplete);
    });

    this.googleMapService.currentAddress.subscribe(res => {
      if (res) {
        this.searchElementRef.nativeElement.value = res.address;
      }
    });
  }

  private registerEventListener(autocomplete: any) {
    google.maps.event.addListener(autocomplete, "place_changed", () => {
      const location = autocomplete.getPlace().geometry.location;
      this.currentPostion = {
        latitude: location.lat(),
        longitude: location.lng()
      };
    });
  }

  setUserCurrentLocation() {
    this.mapsApiLoader.load().then(() => {
      this.getCurrentLocationsCoordinates();
    });
  }

  private getCurrentLocationsCoordinates() {
    navigator.geolocation.getCurrentPosition(pos => {
      if (pos) {
        this.currentPostion = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        this.googleMapService.getUserCurrentAddress(this.currentPostion);
        
      }
    });
  }

  onSubmit(form: NgForm, btn: IsButton, template: TemplateRef<any>) {
    if (this.signupForm.controls.password.value !== this.signupForm.controls.confirmPassword.value) {
      return;
    }
    if (this.signupForm.valid) {
      btn.startLoading();
      let user = this.signupForm.value;
      let newFranchise = {
        service_id : this.serviceId,
        ntn: "123",
        parent_id: this.brandId,
        manager_name: user.name,
        contact : user.contact,
        email : user.email,
        name : this.brandName,
        password :  user.password,
        username :  user.email,
        address : this.searchElementRef.nativeElement.value,
        longitude: this.currentPostion.longitude? this.currentPostion.longitude : 72.22,
        latitude: this.currentPostion.latitude? this.currentPostion.latitude : 33.32,
      }
      this.franchiseAccountService.signup(newFranchise).subscribe(createFranchiseResponse => {
        console.log("Create Franchise Response is : ", createFranchiseResponse)
        btn.stopLoading();
        if(newFranchise) {
          this.isActiveModal.close(newFranchise)
        }   
      }, error => {
        console.log(error)
        if(error){
          this.emailExists = true;
          btn.stopLoading();
        }
      }) 
    } else {
      return;
    }  
  }
}
