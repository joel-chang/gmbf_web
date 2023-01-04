import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './app';
import { BrowserRouter } from 'react-router-dom';
import { CREDS } from "./creds.js"
import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase, onValue, ref, set } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";
//test line
import {
	getAuth,
	connectAuthEmulator,
	signInWithEmailAndPassword,
	GoogleAuthProvider
} from 'firebase/auth';

// firebase stuff
// const analytics = getAnalytics(app);
const app = initializeApp(CREDS);
const db = getDatabase();
if (location.hostname === "localhost") {
	connectDatabaseEmulator(db, "localhost", 9000);
}

const visitCountRef = ref(db, 'pub/common/visitor_count');
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// console.log(auth);
connectAuthEmulator(auth, "http://localhost:9099");
// tensorflow
const tf = require('@tensorflow/tfjs');
const weights = '/web_model/model.json';
const names = ['0_9', '10_11', '12_13', '14_15', '16_17', '18_20', '20_100']

const root = ReactDOMClient.createRoot(document.getElementById('root'))

const loginEmailPassword = async () => {
	const loginEmail = txtEmail.value;
	const loginPassword = txtPassword.value;

	const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
	// console.log(userCredential.user);
}

root.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);

// change to 1 before pushing, change to 0 when working
const is_prod = 0;

// update db visitor count on load website
onValue(visitCountRef, (snapshot) => {
  let data = snapshot.val();
  data += is_prod;
  set(visitCountRef, data);
}, { onlyOnce: true });

// display visitor count displayed in DOM everytime it changes
onValue(visitCountRef, (snapshot) => {
  const data = snapshot.val();
  // document.getElementById("visitor_counter_wrapper").innerHTML = "Visit #" + data;
});

// display number of detections in database
const userCountRef = ref(db, 'pub/common/det_count');
onValue(userCountRef, (snapshot) => {
  const data = snapshot.val();
  // document.getElementById('det_counter_wrapper').innerHTML =  data + " body fat percentage readings to this day.";
});


export {app, provider, auth, db, visitCountRef, is_prod, tf, weights, names, loginEmailPassword};
