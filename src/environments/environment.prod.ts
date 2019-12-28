export const environment = {
  production: false
};

export const apiLMT = {
  url: 'http://localhost:8089/APIlamaintendu'
};

// Config FireBase
export const firebaseConfig = {
  apiKey: 'AIzaSyAYopQkdj7IyhpJck42Zp_ZI-jIctYa0YM',
  authDomain: 'lmtv1-f89c3.firebaseapp.com',
  databaseURL: 'https://lmtv1-f89c3.firebaseio.com',
  projectId: 'lmtv1-f89c3',
  storageBucket: 'lmtv1-f89c3.appspot.com',
  messagingSenderId: '718484088346',
  appId: '1:718484088346:web:91676b57c20d193b',
  externals: {
    '@google-cloud/storage': 'commonjs @google-cloud/storage'
  }
};
