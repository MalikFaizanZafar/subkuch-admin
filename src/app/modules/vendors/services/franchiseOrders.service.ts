import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class FranchiseOrdersService {
  baseURL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  getOrders(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/order/franchise/${id}`, {
      headers
    });
  }
}
