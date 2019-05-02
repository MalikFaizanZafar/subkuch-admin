import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableServicesResponse } from '../models/availableServices';
import { Injectable } from '@angular/core';
import { VendorUser } from '../models/vendor-members';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;
const API_URL = {
  service: `${baseUrl}/api/auth/service?size=30`,
  signup: `${baseUrl}/api/auth/signup`
};

@Injectable()
export class UserAuthService {

  get isAuthenticated() {
     if(localStorage.getItem('Authorization')) {
       return true;
     } else {
       return false;
     }
  }

  constructor(private http: HttpClient){}
  
  getServices(): Observable<AvailableServicesResponse> {
    return this.http.get<AvailableServicesResponse>(API_URL.service);
  }

  signup(data: any) : Observable<any>{
    return this.http.post<any>(API_URL.signup, data);
  }
}
