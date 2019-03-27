import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FranchiseInfoService {
  baseURL : string = 'http://localhost:8080/api'

  constructor( private http : HttpClient){}
  
  getFranchiseInfo( id : number) : Observable<any>{
    return this.http.get<any>(`${this.baseURL}/auth/franchise/${id}`)
  }
}