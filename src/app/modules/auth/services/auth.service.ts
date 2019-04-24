import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableServicesResponse } from '../models/availableServices';
import { Injectable } from '@angular/core';
import { VendorUser } from '../models/vendor-members';

const API_URL = {
  service: '/api/auth/service?size=30',
  signup: '/api/auth/signup'
};

@Injectable()
export class UserAuthService {

  constructor(private http: HttpClient){}
  
  getServices(): Observable<AvailableServicesResponse> {
    return this.http.get<AvailableServicesResponse>(API_URL.service);
  }

  signup(data: VendorUser) : Observable<any>{
    return this.http.post<any>(API_URL.signup, data);
  }
}
