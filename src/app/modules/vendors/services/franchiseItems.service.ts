import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { itemModel } from "../models/itemModel";

@Injectable()
export class FranchiseItemsService {
  baseURL: string = "http://localhost:8080/api/auth";

  constructor(private http: HttpClient) {}

  getItems(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/item/franchise/${id}`, {
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

  uploadItemImage( image : any) : Observable<any> {
    var fd = new FormData();
    fd.append('file', image);
    return this.http.post<any>(`${this.baseURL}/auth/upload`,fd);
  }
}
