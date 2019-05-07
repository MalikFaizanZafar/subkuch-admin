import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _franchiseId: number;
  
  setFranchiseId(id: number) {
    this._franchiseId = id;
    localStorage.setItem('franchiseId', `${id}`);
  }

  get franchiseId(): number {
    if (this._franchiseId) {
      return this._franchiseId;
    } else  {
      return parseInt(localStorage.getItem('franchiseId'), 10);
    }
  }
}
