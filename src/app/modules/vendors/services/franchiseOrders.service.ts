import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';

const baseUrl = environment.baseUrl;
@Injectable()
export class FranchiseOrdersService {
  baseURL: string = `${baseUrl}/api`;
  newOrders = [];

  constructor(private http: HttpClient) {}

  getOrders(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/order/franchise/${id}`, {
      headers
    });
  }

  addNewOrder(order: any) {
    this.newOrders.push(order)
  }
  
  getNewOrders(){
    return this.newOrders
  }

  removeNewOrders(){
    this.newOrders = []
  }
}
