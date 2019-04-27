import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FranchiseInfoService {
  baseURL : string = 'http://localhost:8080/api/auth/franchise'
  private franchiseId;


  constructor( private http : HttpClient){}
  
  setFranchiseId( id : Number){
    this.franchiseId = id
  }
  getFranchiseId(){
    return this.franchiseId
  }

  getFranchiseInfo() : Observable<any>{
    let headers = new HttpHeaders()
    const token = localStorage.getItem('Authorization');
    headers = headers.append(
    'Authorization', token
    );
    return this.http.get<any>(`${this.baseURL}`, {headers})
  }

  editFranchiseLogo(editLogoDto) : Observable<any>{
    let headers = new HttpHeaders()
    const token = localStorage.getItem('Authorization');
    headers = headers.append(
    'Authorization', token
    );
    return this.http.post<any>(`${this.baseURL}/logo`, editLogoDto, {headers})
  }
}