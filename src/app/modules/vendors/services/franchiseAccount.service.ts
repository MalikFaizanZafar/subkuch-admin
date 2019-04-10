import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FranchiseAccountService {
  baseURL : string = 'http://localhost:8080/api'

  constructor( private http : HttpClient){}
  
  setDeviceToken(deviceToken : any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.post<any>(`${this.baseURL}/franchise/56/account`,deviceToken, {
      headers
    });
  }
}