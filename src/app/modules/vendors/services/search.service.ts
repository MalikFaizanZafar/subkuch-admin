import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocationCoordinates } from '@app/shared/models/coordinates';
import { Observable } from 'rxjs';

const API_URL = {
  SEARCH: '/api/franchise/filter'
}

const DefaultDistance = 30;

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  findDefaultItemsByLocation(
    currentLocation: LocationCoordinates, 
    page: number = 1, 
    size: number = 50,
    distance: number = DefaultDistance,
    query: string = '' ): Observable<any> {
    let endPoint = `${API_URL.SEARCH}?page=${page}&size=${size}&distance=${distance}&lat=${currentLocation.latitude}&long=${currentLocation.longitude}`;
    if (query) {
      endPoint = `${endPoint}&filter=${query}`;
    }
    return this.http.get(endPoint);
  }
}
