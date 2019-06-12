import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IsActiveModal } from '../../../../lib/modal';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { LocationCoordinates } from '@app/shared/models/coordinates';
import { GoogleMapService } from '@app/shared/services/google-map.service';

declare var google: any;

@Component({
  selector: 'map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss']
})
export class MapModalComponent implements OnInit {
  location: LocationCoordinates;
  zoom: number = 16;
  currentAddress: string;
  searchControl: FormControl;
  map_loaded: boolean = false;

  @ViewChild("search")
  public searchElementRef: ElementRef;
  
  constructor(
    private activeModal: IsActiveModal,    
    private mapsApiLoader: MapsAPILoader,
    private googleMapService: GoogleMapService) { }

  ngOnInit() {
    this.location = this.activeModal.data.coords;
    //create search FormControl
    this.searchControl = new FormControl();
    //load Places Autocomplete
    this.mapsApiLoader.load().then(() => {
    let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ["address"]
    });

    this.searchElementRef.nativeElement.value = this.activeModal.data.address;

    this.registerEventListener(autocomplete);
  });

  this.googleMapService.currentAddress.subscribe(res => {
    if (res) {
      this.searchElementRef.nativeElement.value = res.address;
    }
  })
  }

  onSave() {
    this.activeModal.close({
      location: this.location,
      address: this.searchElementRef.nativeElement.value
    });
  }

  mapClicked(event: any) {}

  markerDragEnd(event: any) {
    this.location = {
      latitude: event.coords.lat,
      longitude: event.coords.lng,
    }
    this.googleMapService.getUserCurrentAddress(this.location);
  }

  private registerEventListener(autocomplete: any) {
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const location = autocomplete.getPlace().geometry.location;
      this.location = {
        latitude: location.lat(),
        longitude: location.lng()
      }
    });
  }
}
