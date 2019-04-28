import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { itemModel } from "../models/itemModel";
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;

@Injectable()
export class FranchiseItemsService {
  baseURL: string = `${baseUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  getItems(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/item`, {
      headers
    });
  }

  getCategories(): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/itemcategory`, {
      headers
    });
  }

  addCategory( category : any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.post<any>(`${this.baseURL}/itemcategory`,category, {
      headers
    });
  }

  getCategoriesByName( name : string): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/item?category=${name}`, {
      headers
    });
  }

  deleteItems(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.delete<any>(`${this.baseURL}/item/${id}`, {
      headers
    });
  }

  addItem( item : itemModel): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.post<any>(`${this.baseURL}/item`,item, {
      headers
    });
  }

  editItem( item : itemModel, itemId : any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.put<any>(`${this.baseURL}/item/itemId`,item, {
      headers
    });
  }
  uploadItemImage( image : any) : Observable<any> {
    var fd = new FormData();
    fd.append('file', image);
    return this.http.post<any>(`${this.baseURL}/auth/upload`,fd);
  }
}
