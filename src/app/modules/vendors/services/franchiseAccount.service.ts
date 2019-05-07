import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DataService } from '@app/shared/services/data.service';

const baseUrl = environment.baseUrl;
@Injectable()
export class FranchiseAccountService {
  baseURL: string = `${baseUrl}/api/auth`;

  constructor(private http: HttpClient, private dataService: DataService) {}

  setDeviceToken(deviceToken: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = localStorage.getItem('Authorization');
    headers = headers.append('Authorization', token);
    let deviceTokenPostDto = {
      franchiseId: this.dataService.franchiseId,
      token: deviceToken.token
    };

    return this.http.post<any>(
      `${this.baseURL}/franchise/notifications`,
      deviceTokenPostDto,
      {
        headers
      }
    );
  }
}
