import $ from "dom7";

import Framework7 from "framework7/bundle";

// Import F7 Styles
import "framework7/framework7-bundle.css";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.css";


// Import Routes
import routes from "./routes.js";
// Import main app component
import App from "../app.f7.html";
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";


var app = new Framework7({
  name: "Ambulance Tracker", // App name
  theme: "auto", // Automatic theme detection
  el: "#app", // App root element
  component: App, // App main component
  // App routes
  routes: routes,
  // Register service worker
  serviceWorker: {
    path: "/service-worker.js",
  },
});
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8dDiGzBMWw2JRAqdfLnHILQA0XHBFBFU",
  authDomain: "ambulancetrackerweb.firebaseapp.com",
  databaseURL: "https://ambulancetrackerweb-default-rtdb.firebaseio.com",
  projectId: "ambulancetrackerweb",
  storageBucket: "ambulancetrackerweb.appspot.com",
  messagingSenderId: "35818978401",
  appId: "1:35818978401:web:882a658ddba4816ec6fe20",
  measurementId: "G-C3M80W1F3Y"
};