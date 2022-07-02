import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAArrWcTYxpulPDuwIRyM0EZaMHfMSUT3Q",
  authDomain: "travel-app-15eb6.firebaseapp.com",
  projectId: "travel-app-15eb6",
  storageBucket: "travel-app-15eb6.appspot.com",
  messagingSenderId: "996540315419",
  appId: "1:996540315419:web:7eded340c21165d3b085be",
  measurementId: "G-5C7E954FJ5",
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default storage;
