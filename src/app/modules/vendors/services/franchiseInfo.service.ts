import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FranchiseInfoService {
  baseURL : string = '/api/auth/franchise'

  constructor( private http : HttpClient){}
  
  getFranchiseInfo() : Observable<any>{
    let headers = new HttpHeaders()
    const token = localStorage.getItem('Authorization');
    headers = headers.append(
    'Authorization', token
    );
    return this.http.get<any>(`${this.baseURL}`, {headers})
  }
}