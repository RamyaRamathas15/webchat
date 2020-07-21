import * as firebase from "firebase/app";
import * as firebasestorage from "firebase";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7L8az3ZXHUJBigs9tcRQTZwC2Koiuy4E",
  authDomain: "clear-gantry-283402.firebaseapp.com",
  databaseURL: "https://clear-gantry-283402.firebaseio.com",
  projectId: "clear-gantry-283402",
  storageBucket: "clear-gantry-283402.appspot.com",
  messagingSenderId: "1040274309787",
  appId: "1:1040274309787:web:46952bd121dd1b80ab7c3e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const myStorage = firebasestorage.storage();

export default firebase;
