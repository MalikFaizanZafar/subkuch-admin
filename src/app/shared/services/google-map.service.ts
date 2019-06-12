import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/internal/observable';
import { LocationCoordinates } from '@app/shared/models/coordinates';
import { BehaviorSubject } from 'rxjs';

declare var google: any;
interface AddressInfo {
  address?: string;
  city?: string; 
}

@Injectable()
export class GoogleMapService {
  private _address: any;
  currentAddress: BehaviorSubject<AddressInfo> = new BehaviorSubject(null);

  get address(){
    return this._address;
  }
  set address(value: any) {
    this._address = value;
    if (value) {
      this.getAddress(this.address).subscribe(res => {
        if (res) {
          this.currentAddress.next(res);
        }
      });
    }
  }  

  getAddress(currentAddress: any[] ): Observable<AddressInfo> {
    let addressString = '';
    let cityName = '';
    const street = this.getParsedAddress(currentAddress, 'street_number');
    addressString += street? `${street.long_name}, `: ''; 
    const route = this.getParsedAddress(currentAddress, 'route');
    addressString += route? `${route.long_name}, `: ''; 
    const area = this.getParsedAddress(currentAddress, 'sublocality');
    addressString += area? `${area.long_name}, `: ''; 
    const city = this.getParsedAddress(currentAddress, 'locality');
    addressString += city? `${city.long_name}, `: ''; 
    cityName =  city? `${city.long_name}, `: '';
    const country = this.getParsedAddress(currentAddress, 'country');
    addressString += country? `${country.long_name}`: ''; 
    return of({address: addressString, city: cityName});
  }

  getUserCurrentAddress(currentPostion: LocationCoordinates) {
    const latlng = new google.maps.LatLng(currentPostion.latitude, currentPostion.longitude);
    const geocoder = new google.maps.Geocoder();
    const self = this;
    geocoder.geocode({
      'latLng': latlng
    }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results.length > 0 ) {
          self.address = results[0];  
        } else {
          alert('No results found');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  }

  private getParsedAddress(responseArr: any, type: string) {
    return responseArr.address_components.filter(item => item.types.includes(type))[0];
  }
}
