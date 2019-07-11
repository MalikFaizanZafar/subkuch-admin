import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable()
export class FranchiseAuthService {
  baseURL : string = `${baseUrl}/api/auth/login/admin`

  constructor( private http : HttpClient){}
  
  login( username : string, password : string) : Observable<any>{
    return this.http.post<any>(`${this.baseURL}`, { username, password, keep_logged : 1})
  }

  forgotEmailPost(data: any) : Observable<any>{
    return this.http.post<any>(`${this.baseURL}/forgot-password`, data);
  }

  forgotVerifyCodePost(data: any) : Observable<any>{
    return this.http.post<any>(`${this.baseURL}/verify-code`, data);
  }

  forgotPasswordPost(data: any) : Observable<any>{
    return this.http.post<any>(`${this.baseURL}/reset-password`, data);
  }
}