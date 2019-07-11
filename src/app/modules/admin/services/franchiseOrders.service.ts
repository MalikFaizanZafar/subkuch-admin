import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';
import { OrderRequest } from "../models/order";

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

  changeOrderStatus( data : any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.put<any>(`${this.baseURL}/order/status`, data,{
      headers
    });
  }

  verifyUser(value: string, type: string) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/auth/user?${type}=${value}`, {
      headers
    });
  }

  createOrder(data: OrderRequest): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.post<any>(`${this.baseURL}/order`, data, {headers})
  }

  updateOrder(data: OrderRequest, id: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.put<any>(`${this.baseURL}/order/${id}`, data, {headers})
  }

  updateOrderStatus(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.put<any>(`${this.baseURL}/order/status`, data, {headers})
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
