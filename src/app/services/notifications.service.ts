import { Injectable, OnInit }          from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth }     from '@angular/fire/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { FranchiseAccountService } from 'app/modules/admin/services/franchiseAccount.service';
import { FranchiseOrdersService } from 'app/modules/admin/services/franchiseOrders.service';

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
    let deviceId = localStorage.getItem("subquch-deviceId");
    if(deviceId == null){
      let tokenId = Math.floor(Math.random()*10000000)
      localStorage.setItem("subquch-deviceId", `${tokenId}`);
      const data = { [`${tokenId}`]: token }
      this.db.object('fcmTokens/').update(data)
    }else{
      const data = { [`${deviceId}`]: token }
      this.db.object('fcmTokens/').update(data)
    }
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        
        return this.messaging.getToken()
      })
      .then(token => {
        this.updateToken(token)
        this.franchiseAccountService.setDeviceToken({token}).subscribe(resp => {
          console.log('set Device Token : ', resp);
        })
      })
      .catch((err) => {
        console.log('token not generated');
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
         let notif = JSON.parse(payload.data.notification)
        if(notif != null){
          this.currentMessage.next({id: notif.id, type: notif.type});
        }
        //  console.log("notif : ", notif);
        // if(notif.type === 'order'){
        //   this.franchiseOrdersService.addNewOrder(payload.data.order);
        //   this.currentMessage.next(payload);
        // }else {
        //   this.currentMessage.next(notif.body);
        // }
      });
    }
}