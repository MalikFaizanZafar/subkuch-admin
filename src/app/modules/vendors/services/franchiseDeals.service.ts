import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { dealModel } from "../models/dealModel";

@Injectable()
export class FranchiseDealsService {
  baseURL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  getDeals(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/deal/franchise/${id}`, {
      headers
    });
  }
  deleteDeal(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.delete<any>(`${this.baseURL}/deal/${id}`, {
      headers
    });
  }
  addDeal(deal: dealModel): Observable<any> {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.post<any>(`${this.baseURL}/deal`, deal, {
      headers
    });
  }
}
