// / <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {MapsAPILoader} from '@agm/core';
declare const google: any;
@Component({
  selector: 'location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {

  lat: number = 33.6694;
  lang: number = 72.9972;
  zoom: number = 16;
  @ViewChild("search")
  public searchElementRef: ElementRef
  
  constructor(private _loader: MapsAPILoader) { }

  ngOnInit() {
    console.log('google has : ', google)
  }

  searchLocation(){
    console.log('searchLocation called');
    this._loader.load().then(() => {
      console.log('loader called');
      console.log('google.maps has : ', google.maps)
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener('place_changed', () => {
        let place = autocomplete.getPlace();
          console.log('place has ', place);
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.lat = place.geometry.location.lat();
          this.lang = place.geometry.location.lng();
          console.log('lat has : ', this.lat);
          console.log('lang has : ', this.lang);
      });
  });
  }
  markerDragEnd($event: MouseEvent) {
    // console.log('dragEnd', $event);
  }
}
