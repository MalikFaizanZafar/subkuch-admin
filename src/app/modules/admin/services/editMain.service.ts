
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class EditMainService {
  editEnable: BehaviorSubject<boolean> = new BehaviorSubject(false);
}