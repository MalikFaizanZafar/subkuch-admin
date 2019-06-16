import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ElementRef,
  ViewChild,
  Input
} from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserDetailsService } from '../../services/userDetails.service';
import { IsModalService, IsModalSize } from 'app/lib/modal';
import { GoogleMapService } from '@app/shared/services/google-map.service';
import { MapsAPILoader } from '@agm/core';
import { LocationCoordinates } from '@app/shared/models/coordinates';
import { MapModalComponent } from '@app/shared/map-modal/components/map-modal/map-modal.component';
import { SearchService } from '../../services/search.service';
import { FranchiseInfoService } from '../../services/franchiseInfo.service';
import { IsToasterService, IsToastPosition } from '../../../../lib/toaster';
import { IsCheckboxChange, IsButton } from 'app/lib';

interface FranchiseContact {
  email?: string;
  franchiseContactId?: number;
  franchiseContactPersonName?: string;
  franchiseContactPersonPhone?: string;
  franchiseId?: number;
}
declare var google: any;

const startTime: Date = new Date();
startTime.setHours(9);
startTime.setMinutes(0);
const endTime: Date = new Date();
endTime.setHours(23);
endTime.setMinutes(0);
@Component({
  selector: 'edit-overview',
  templateUrl: './edit-overview.component.html',
  styleUrls: ['./edit-overview.component.scss']
})
export class EditOverviewComponent implements OnInit {
  @Input()
  data: any;
  overviewForm: FormGroup;
  dragging: boolean;
  loaded: boolean;
  imageSrc: any;
  imageLoaded: boolean;
  currentPostion: LocationCoordinates;
  currentAddress: string;
  setDeliveryRange = false;
  city: string;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  @Output() overviewEdited: EventEmitter<any> = new EventEmitter();
  @Output() overviewEditedCancelled: EventEmitter<any> = new EventEmitter();

  constructor(
    private toast: IsToasterService,
    private mapsApiLoader: MapsAPILoader,
    private googleMapService: GoogleMapService,
    private modal: IsModalService,
    private franchiseServcie: FranchiseInfoService
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.overviewForm = new FormGroup({
      welcomeParagraph: new FormControl(this.data.welcomeNote || '', [
        Validators.required
      ]),
      contactOne: new FormControl(
        this.data.contact[0]
          ? this.data.contact[0].franchiseContactPersonName || ''
          : '',
        [Validators.required]
      ),
      // contactTwo: new FormControl(
      //   this.data.contact[1]
      //     ? this.data.contact[1].franchiseContactPersonName || ''
      //     : ''
      // ),
      phoneOne: new FormControl(
        this.data.contact[0]
          ? this.data.contact[0].franchiseContactPersonPhone || ''
          : '',
        [Validators.required]
      ),
      // phoneTwo: new FormControl(
      //   this.data.contact[1]
      //     ? this.data.contact[1].franchiseContactPersonPhone || ''
      //     : ''
      // ),
      emailOne: new FormControl(
        this.data.contact[0] ? this.data.contact[0].email || '' : '',
        [Validators.required]
      ),
      // emailTwo: new FormControl(
      //   this.data.contact[1] ? this.data.contact[1].email || '' : ''
      // ),
      location: new FormControl(this.data.address || '', [Validators.required]),
      startTime: new FormControl(new Date(this.data.startTime) || startTime, [
        Validators.required
      ]),
      endTime: new FormControl(new Date(this.data.endTime) || endTime, [
        Validators.required
      ]),
      delivery: new FormControl( this.data.doDelivery || false),
      deliveryRange: new FormControl( this.data.deliveryRange || 1)
    });

    this.mapsApiLoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address']
        }
      );

      this.registerEventListener(autocomplete);
    });

    this.googleMapService.currentAddress.subscribe(res => {
      if (res) {
        this.searchElementRef.nativeElement.value = res.address;
        this.city = res.city;
      }
    });

    if (!this.data.address) {
      this.setUserCurrentLocation();
    } else {
      this.currentPostion = {
        latitude: this.data.latitude,
        longitude: this.data.longitude
      };
      this.searchElementRef.nativeElement.value = this.data.address;
    }
  }

  submitHandler(form: NgForm, btn: IsButton) {
    console.log("form valid ?", form.invalid)
    btn.startLoading()
    this.overviewForm.controls['location'].setValue(
      this.searchElementRef.nativeElement.value
    );
    if (form.invalid) {
      return;
    }
    let overviewData = {
      welcomeParagraph: this.overviewForm.get('welcomeParagraph').value,
      contact: [
        {
          email: this.overviewForm.get('emailOne').value,
          phone: this.overviewForm.get('phoneOne').value
        }
        // {
        //   email: this.overviewForm.get('emailTwo').value,
        //   phone: this.overviewForm.get('phoneTwo').value
        // }
      ],
      start: this.overviewForm.get('startTime').value,
      end: this.overviewForm.get('endTime').value,
      address: this.currentAddress,
      longitude: this.currentPostion.longitude,
      latitude: this.currentPostion.latitude,
      welcomeNote: this.overviewForm.get('welcomeParagraph').value,
      delivery: this.overviewForm.get('delivery').value,
      deliveryRange: this.overviewForm.get('deliveryRange').value,
    };
    const contacts: FranchiseContact[] = [];
    const contact1: FranchiseContact = {
      email: this.overviewForm.get('emailOne').value,
      franchiseContactPersonName: this.overviewForm.get('contactOne').value,
      franchiseContactPersonPhone: this.overviewForm.get('phoneOne').value,
      franchiseId: this.data.id,
      franchiseContactId: this.data.contact[0]
        ? this.data.contact[0].franchiseContactId
        : null
    };
    contacts.push(contact1);

    // if (
    //   this.overviewForm.get('emailTwo').value ||
    //   this.overviewForm.get('phoneTwo').value ||
    //   this.overviewForm.get('contactTwo').value
    // ) {
    //   const contact2: FranchiseContact = {
    //     email: this.overviewForm.get('emailTwo').value,
    //     franchiseContactPersonName: this.overviewForm.get('contactTwo').value,
    //     franchiseContactPersonPhone: this.overviewForm.get('phoneTwo').value,
    //     franchiseId: this.data.id,
    //     franchiseContactId: this.data.contact[1]
    //       ? this.data.contact[1].franchiseContactId
    //       : null
    //   };
    //   contacts.push(contact2);
    // }
    this.data.address = this.searchElementRef.nativeElement.value;
    this.data.latitude = `${overviewData.latitude}`;
    this.data.longitude = `${overviewData.longitude}`;
    this.data.welcomeNote = overviewData.welcomeNote;
    this.data.startTime = new Date(overviewData.start);
    this.data.endTime = new Date(overviewData.end);
    this.data.contact = contacts;
    this.data.city = this.city;
    this.data.doDelivery = overviewData.delivery;
    this.data.deliveryRange = overviewData.deliveryRange;

    this.franchiseServcie
      .updateFranchiseInfo(this.data.id, this.data)
      .pipe()
      .subscribe(overview => {
        btn.stopLoading()
        this.toast.popSuccess('Franchise info updated successfully', {
          position: IsToastPosition.BottomRight
        });
        this.overviewEdited.emit(null);
        this.overviewForm.reset();
      });
  }

  cancelEditing() {
    this.overviewForm.reset();
    this.overviewEditedCancelled.emit(null);
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
        alert('invalid format');
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
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const location = autocomplete.getPlace().geometry.location;
      this.currentPostion = {
        latitude: location.lat(),
        longitude: location.lng()
      };
      this.openModalPopup();
    });
  }

  private openModalPopup() {
    const modalRef = this.modal.open(MapModalComponent, {
      data: {
        coords: this.currentPostion,
        address: this.searchElementRef.nativeElement.value
      },
      size: IsModalSize.Large
    });

    modalRef.onClose.subscribe(res => {
      if (res) {
        this.searchElementRef.nativeElement.value = res.address;
        this.currentPostion.latitude = res.location.latitude;
        this.currentPostion.longitude = res.location.longitude;
      }
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

  onDeliverFlag(value: IsCheckboxChange) {
    if (value.checked) {
      this.setDeliveryRange = true;
    } else {
      this.setDeliveryRange = false;
      this.overviewForm.controls.deliveryRange.setValue(null);
    }
  }
}
