importScripts("https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.4.3/firebase-firestore.js");

var firebaseConfig = {
  apiKey: "AIzaSyD8dDiGzBMWw2JRAqdfLnHILQA0XHBFBFU",
  authDomain: "ambulancetrackerweb.firebaseapp.com",
  databaseURL: "https://ambulancetrackerweb-default-rtdb.firebaseio.com",
  projectId: "ambulancetrackerweb",
  storageBucket: "ambulancetrackerweb.appspot.com",
  messagingSenderId: "35818978401",
  appId: "1:35818978401:web:882a658ddba4816ec6fe20",
  measurementId: "G-C3M80W1F3Y",
};
// Initialize Firebase
const workerEndpoint = firebase.initializeApp(firebaseConfig);
const firestore = app.firestore();
importScripts("https://unpkg.com/comlink@alpha/dist/umd/comlink.min.js");
// remember to use our own url https://ambulancetrackerweb.web.app/js/modules/comlink.min.js
// off the main script calculations.
const remoteFunction = {
  counter: 0,
  inc() {
    this.counter++;
  },
  abc() {
    return "hello"
  }
}
Comlink.expose(remoteFunction)
/* Calculating distance between 2 points

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

*/