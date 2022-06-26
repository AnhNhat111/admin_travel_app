import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBDe9-1Bcx_jgYiahubcyoQHcb4kDrFtpg",
  authDomain: "api-travel-app.firebaseapp.com",
  projectId: "api-travel-app",
  storageBucket: "api-travel-app.appspot.com",
  messagingSenderId: "491957778145",
  appId: "1:491957778145:web:9bf2a96fdd7383de3329a0"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app)

export default storage;