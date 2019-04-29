// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080',
  googleMapsAPI: {
    apiKey: "AIzaSyB-EsaismaaJDTBDg0F2l-28Z-7zsVCTWU ",
    libraries: ["places"]
  },
  firebase: {
    apiKey: "AIzaSyBVuIpEpE4Ke9xam26eRzVZItTslj6iTMY",
    authDomain: "subquch-d4369.firebaseapp.com",
    databaseURL: "https://subquch-d4369.firebaseio.com",
    projectId: "subquch-d4369",
    storageBucket: "gs://subquch-d4369.appspot.com",
    messagingSenderId: "54989238851"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
