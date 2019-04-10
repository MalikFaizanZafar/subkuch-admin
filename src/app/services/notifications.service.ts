import { Injectable }          from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth }     from '@angular/fire/auth';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class NotificationsService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }


  updateToken(token) {
    const data = { ['123']: token }
    this.db.object('fcmTokens/').update(data)
    // this.afAuth.authState.take(1).subscribe(user => {
    //   console.log('User is ', user);
    //   if (!user) return;

    //   const data = { [user.uid]: token }
    //   this.db.object('fcmTokens/').update(data)
    // })
    // console.log('User false');
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