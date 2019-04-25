import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserDetailsService } from "../../services/userDetails.service";
import { IsModalService, IsModalSize } from "app/lib/modal";
import { GoogleMapService } from "@app/shared/services/google-map.service";
import { MapsAPILoader } from "@agm/core";
import { LocationCoordinates } from "@app/shared/models/coordinates";
import { LocationSelectorComponent } from "../../modal/location-selector/location-selector/location-selector.component";
import { MapModalComponent } from "@app/shared/map-modal/components/map-modal/map-modal.component";
import { SearchService } from "../../services/search.service";

declare var google: any;

@Component({
  selector: "edit-overview",
  templateUrl: "./edit-overview.component.html",
  styleUrls: ["./edit-overview.component.scss"]
})
export class EditOverviewComponent implements OnInit {
  overviewForm: FormGroup;
  dragging: boolean;
  loaded: boolean;
  imageSrc: any;
  imageLoaded: boolean;
  currentPostion: LocationCoordinates;
  currentAddress: string;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  @Output() overviewEdited: EventEmitter<any> = new EventEmitter();
  @Output() overviewEditedCancelled: EventEmitter<any> = new EventEmitter();

  constructor(
    private userDetailsService: UserDetailsService,
    private mapsApiLoader: MapsAPILoader,
    private googleMapService: GoogleMapService,
    private modal: IsModalService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.overviewForm = new FormGroup({
      welcomeParagraph: new FormControl(null, [Validators.required]),
      phoneOne: new FormControl(null, [Validators.required]),
      phoneTwo: new FormControl(null),
      email: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required])
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
      this.searchElementRef.nativeElement.value = res;
    });

    this.setUserCurrentLocation();
  }

  submitHandler() {
    let overviewData = {
      welcomeParagraph: this.overviewForm.get("welcomeParagraph").value,
      contact: {
        phone: [
          this.overviewForm.get("phoneOne").value,
          this.overviewForm.get("phoneTwo").value
        ],
        email: [this.overviewForm.get("email").value]
      },
      openingStatus: {
        start: this.overviewForm.get("startTime").value,
        end: this.overviewForm.get("endTime").value
      }
    };
    let id = localStorage.getItem("user");
    this.userDetailsService
      .addUserOverview(id, overviewData)
      .pipe()
      .subscribe(overview => {
        console.log("Response is : ", overview);
        this.overviewEdited.emit(null);
      });
    this.overviewForm.reset();
  }

  cancelEditing() {
    this.overviewForm.reset();
    this.overviewEditedCancelled.emit(null);
  }

  onLocationTouch() {
    this.modal.open(LocationSelectorComponent, {
      size: IsModalSize.Large
    });
  }

  handleDragEnter() {
    this.dragging = true;
  }

  handleDragLeave() {
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file) {
      const pattern = /image-*/;
      const reader = new FileReader();

      if (!file.type.match(pattern)) {
        alert("invalid format");
        return;
      }

      this.loaded = false;
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }

  private registerEventListener(autocomplete: any) {
    google.maps.event.addListener(autocomplete, "place_changed", () => {
      const location = autocomplete.getPlace().geometry.location;
      this.currentPostion = {
        latitude: location.lat(),
        longitude: location.lng()
      };
      this.modal.open(MapModalComponent, {
        data: {
          coords: this.currentPostion,
          address: this.searchElementRef.nativeElement.value
        },
        size: IsModalSize.Large
      });
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
      this.loadFranchiseAndDeals();
    });
  }

  private loadFranchiseAndDeals() {
    this.searchService.findDefaultItemsByLocation(this.currentPostion).subscribe(res => {
      console.log(res);
    });
  }
}
