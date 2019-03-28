import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class FranchiseSalesService {
  baseURL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) {}

  getSales(id: number): Observable<any> {
    let headers = new HttpHeaders();
    const token = localStorage.getItem("Authorization");
    headers = headers.append("Authorization", token);
    return this.http.get<any>(`${this.baseURL}/sales/${id}?start=2019-03-13&end=2019-03-14`, {
      headers
    });
  }
}
