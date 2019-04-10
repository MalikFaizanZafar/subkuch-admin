import { Injectable }          from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth }     from '@angular/fire/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { FranchiseAccountService } from 'app/modules/vendors/services/franchiseAccount.service';

@Injectable()
export class NotificationsService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private franchiseAccountService : FranchiseAccountService) { }


  updateToken(token) {
    const data = { ['53']: token }
    this.db.object('fcmTokens/').update(data)
  }

  getPermission() {
      this.messaging.requestPermission()
      .then(() => {
        console.log('Notification permission granted.');
        return this.messaging.getToken()
      })
      .then(token => {
        // console.log("token is :", token)
        this.updateToken(token)
        this.franchiseAccountService.setDeviceToken({token}).subscribe(resp => {
          console.log("Resp has : ", resp)
        })
      })
      .catch((err) => {
        console.log('Unable to get permission to notify.', err);
      });
    }

    receiveMessage() {
       this.messaging.onMessage((payload) => {
        console.log("Message received. ", payload);
        this.currentMessage.next(payload)
      });

    }
}