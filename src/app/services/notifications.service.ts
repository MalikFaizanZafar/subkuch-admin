import { Injectable, OnInit }          from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth }     from '@angular/fire/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { FranchiseAccountService } from 'app/modules/vendors/services/franchiseAccount.service';
import { FranchiseOrdersService } from 'app/modules/vendors/services/franchiseOrders.service';

@Injectable()
export class NotificationsService {

  messaging = firebase.messaging();
  updateFranchise: BehaviorSubject<boolean> = new BehaviorSubject<any>(false);
  currentMessage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  
  constructor(
    private db: AngularFireDatabase, 
    private afAuth: AngularFireAuth, 
    private franchiseAccountService : FranchiseAccountService, 
    private franchiseOrdersService : FranchiseOrdersService) {
      this.listenBackgroundNotification();
    }

  listenBackgroundNotification() {
    const self = this;
    let listener = new BroadcastChannel('listener');
    listener.onmessage = function(e) {
      console.log(e);
      if(e.data) {
        self.currentMessage.next(e.data);
      }
    }
  }

  updateToken(token) {
    const data = { ['53']: token }
    this.db.object('fcmTokens/').update(data)
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        
        return this.messaging.getToken()
      })
      .then(token => {
        
        this.updateToken(token)
        this.franchiseAccountService.setDeviceToken({token}).subscribe(resp => {
          
        })
      })
      .catch((err) => {
        console.log('token now generated');
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        this.franchiseOrdersService.addNewOrder(payload.data.order);
        this.currentMessage.next(payload);
      });
    }
}