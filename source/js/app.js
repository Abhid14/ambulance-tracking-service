var $$ = Dom7,
  app = new Framework7({
    id: "ambulancetracker",
    root: "#app",
    theme: "md",
    routes,
    routes,
  });
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
firebase.analytics();
function getNext() {
  globalThis.swiper = document.querySelector(".swiper-container").swiper;
  swiper.allowTouchMove = false;
  // Now you can use all slider methods like
  swiper.slideNext();
}
function setDept(userDept) {
  globalThis.userDept = userDept;
  switch (userDept) {
    case "amb":
      document.getElementById("deptImage").innerHTML =
        "<img class='appstatusf' style='height: 150px; width: 150px; border-radius: 50%' src = '../static/icons/logo-256.png' />";
      break;
    case "pol":
      document.getElementById("deptImage").innerHTML =
        "<img class='appstatusf' style='height: 150px; width: 150px; border-radius: 50%' src = '../static/icons/police.jpg' />";
      break;
  }
  swiper.slideNext();
}
function getPolData(uid) {
  const query = db
    .collection("users")
    .doc("police")
    .collection("accounts")
    .doc(uid);
  query
    .get()
    .then((doc) => {
      if (doc.exists) {
        policeData = doc.data();
        localStorage.setItem("userNameP", policeData.userName);
        localStorage.setItem("userBranchP", policeData.userBranch);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
function getAmbData(uid) {
  const query = db
    .collection("users")
    .doc("ambulance")
    .collection("accounts")
    .doc(uid);
  query
    .get()
    .then((doc) => {
      if (doc.exists) {
        ambulanceData = doc.data();
        localStorage.setItem("userNameA", ambulanceData.userName);
        localStorage.setItem("userBranchA", ambulanceData.userBranch);
        localStorage.setItem("vehicleNumber", ambulanceData.vehicleNumber);

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
function signIn() {
  //const emID = document.getElementById("emID")
  document.getElementById("login-form");
  if (app.input.validateInputs(document.getElementById("login-form"))) {
    app.dialog.preloader("Signing In...");
    var formData = app.form.convertToData("#login-form");
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase
          .auth()
          .signInWithEmailAndPassword(formData.email, formData.password)
          .then(() => {
            localStorage.setItem("loggedDept", userDept);
          });
      })
      .catch(function (error) {
        app.dialog.close();
        // Handle Errors here.
        if (error.code == "auth/network-request-failed") {
          var errorMsg = "Network error! Please check your connection.";
        } else {
          var errorMsg = "Invalid Email/Password! Try again.";
        }
        app.toast
          .create({
            text: errorMsg,
            closeTimeout: 3000,
          })
          .open();
      });
  } else {
    app.toast
      .create({
        text: "Fill the required fields with valid details!",
        closeTimeout: 2000,
      })
      .open();
  }
}
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var loggedDept = localStorage.getItem("loggedDept");

    if (document.getElementById("resetloginform")) {
      document.getElementById("resetloginform").click();
      app.dialog.close();
    }

    document.getElementById(loggedDept).click();
    setTimeout(() => {
      switch (loggedDept) {
        case "amb":
          getAmbData(user.uid)
          document.getElementById("userNameA").innerText = localStorage.getItem('userNameA');
          document.getElementById("userBranchA").innerText = localStorage.getItem('userBranchA');
          document.getElementById("vehicleNumber").innerText = localStorage.getItem('vehicleNumber');
          document.getElementById("userEmailA").innerText = user.email;
          break;
        case "pol":
          getPolData(user.uid)
          document.getElementById("userNameP").innerText = localStorage.getItem('userNameP');
          document.getElementById("userBranchP").innerText = localStorage.getItem('userBranchP');
          document.getElementById("userEmailP").innerText = user.email;
          break;
      }
      //todo set ambulance and police
      //document.getElementById("userNameP").innerText = "ABCD";
    }, 1000);
    // ...
  } else {
    // User is signed out.
    // ...
    document.getElementById("log").click();
  }
});
function signUsrOut() {
  localStorage.clear()
  firebase
    .auth()
    .signOut()
    .catch(function (error) {
      if (error.code == "auth/network-request-failed") {
        var errorMsg = "Network error! Please check your connection.";
      } else {
        var errorMsg = "Error signing out! Please try again";
      }
      app.toast
        .create({
          text: errorMsg,
          closeTimeout: 3000,
        })
        .open();
    });
}

function getmap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw";
  var map = new mapboxgl.Map({
    container: "map", // container id
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [78.31332119498711, 21.80992239473943], // starting position [lng, lat]
    zoom: 3, // starting zoom
  });
  // Add geolocate control to the map.
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );
}
function sendDataAmb(x) {
  x
}
function recieveDataPolice(x) {
  x
}