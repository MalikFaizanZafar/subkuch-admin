import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FranchiseAuthService {
  baseURL : string = 'http://localhost:8080/api'

  constructor( private http : HttpClient){}
  
  login( username : string, password : string) : Observable<any>{
    return this.http.post<any>(`${this.baseURL}/auth/login`, { username, password, keep_logged : 1})
  }
}