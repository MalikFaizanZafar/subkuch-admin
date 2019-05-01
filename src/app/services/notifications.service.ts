import { Injectable, OnInit }          from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth }     from '@angular/fire/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { FranchiseAccountService } from 'app/modules/vendors/services/franchiseAccount.service';

@Injectable()
export class NotificationsService implements OnInit {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);
  
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private franchiseAccountService : FranchiseAccountService) { }

  ngOnInit() {
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

  doSomething() {
    console.log('tests');  
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
        
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        
        this.currentMessage.next(payload)
      });
    }
}