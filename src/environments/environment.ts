// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const apiLMT2 = {
  url: 'http://94.23.204.130:8080/lamaintenduapi'
};

export const apiLMT1 = {
  url: 'http://localhost:8080/lamaintenduapi',
 };

export const apiLMT = {
   url: 'http://94.23.204.130:8280/lmt'
};
// Config FireBase
export const firebaseConfig = {
  //   apiKey: 'AIzaSyAYopQkdj7IyhpJck42Zp_ZI-jIctYa0YM',
  //   authDomain: 'lmtv1-f89c3.firebaseapp.com',
  //   databaseURL: 'https://lmtv1-f89c3.firebaseio.com',
  //   projectId: 'lmtv1-f89c3',
  //   storageBucket: 'lmtv1-f89c3.appspot.com',
  //   messagingSenderId: '718484088346',
  //   appId: '1:718484088346:web:91676b57c20d193b',
  // externals: {
  //   '@google-cloud/storage': 'commonjs @google-cloud/storage'
  // angularFireAuth: 'http://10.0.2.7:8280/lmtwso',
    apiKey: 'AIzaSyAYopQkdj7IyhpJck42Zp_ZI-jIctYa0YM',
    // authDomain: 'lmtv1-f89c3.firebaseapp.com',
    // databaseURL: 'https://lmtv1-f89c3.firebaseio.com',
     projectId: 'lmtv1-f89c3'
    // storageBucket: 'lmtv1-f89c3.appspot.com',
    // messagingSenderId: '718484088346',
    // appId: '1:718484088346:web:91676b57c20d193b',
 //  externals: {
 //    '@google-cloud/storage': 'commonjs @google-cloud/storage'
 //
 // }
  };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
