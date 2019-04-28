import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable()
export class FranchiseInfoService {
  baseURL : string = `${baseUrl}/api/auth/franchise`
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

  updateFranchiseInfo(id: number, data: any) : Observable<any>{
    let headers = new HttpHeaders()
    const token = localStorage.getItem('Authorization');
    headers = headers.append(
    'Authorization', token
    );
    return this.http.put<any>(`${this.baseURL}/${id}`, data,  {headers})
  }

  editFranchiseLogo(editLogoDto) : Observable<any>{
    let headers = new HttpHeaders()
    const token = localStorage.getItem('Authorization');
    headers = headers.append(
    'Authorization', token
    );
    return this.http.post<any>(`${this.baseURL}/logo`, editLogoDto, {headers})
  }

  editFranchiseBanner(editBannerDto) : Observable<any>{
    let headers = new HttpHeaders()
    const token = localStorage.getItem('Authorization');
    headers = headers.append(
    'Authorization', token
    );
    return this.http.post<any>(`${this.baseURL}/banner`, editBannerDto, {headers})
  }
}