importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');


firebase.initializeApp({
  'messagingSenderId': '54989238851'
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  var notif = JSON.parse(payload.data.notification);
  var notificationOptions = {
    body: notif.body,
    click_action: notif.click_action,
    icon: `${notif.click_action}/assets/subquch-light-logo.png`
  };

  var listener = new BroadcastChannel('listener');
  listener.postMessage(notif);

  return self.registration.showNotification(notif.title, notificationOptions);
});