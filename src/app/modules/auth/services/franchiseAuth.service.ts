import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FranchiseAuthService {
  baseURL : string = '/api/auth/login'

  constructor( private http : HttpClient){}
  
  login( username : string, password : string) : Observable<any>{
    return this.http.post<any>(`${this.baseURL}`, { username, password, keep_logged : 1})
  }
}