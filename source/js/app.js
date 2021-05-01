//"./modules/comlink.min.mjs";
var $$ = Dom7;
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
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
        localStorage.setItem("userUID", uid);
        localStorage.setItem("userNameP", policeData.userName);
        localStorage.setItem("userBranchP", policeData.userBranch);
        localStorage.setItem("userSynced", "true");
      } else {
        // doc.data() will be undefined in this case
        app.dialog.alert(
          "User data doesn't exists / missing from the server please contact your administrator!"
        );
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
  //  }
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
        localStorage.setItem("userUID", uid);
        localStorage.setItem("userNameA", ambulanceData.userName);
        localStorage.setItem("userBranchA", ambulanceData.userBranch);
        localStorage.setItem("vehicleNumber", ambulanceData.vehicleNumber);
      } else {
        // doc.data() will be undefined in this case
        app.dialog.alert(
          "User data doesn't exists / missing from the server please contact your administrator!"
        );
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}
function signIn() {
  if (app.input.validateInputs(document.getElementById("login-form"))) {
    app.dialog.preloader("Signing In...");
    var formData = app.form.convertToData("#login-form");
    firebase
      .auth()
      .signInWithEmailAndPassword(formData.email, formData.password)
      .then(() => {
        localStorage.setItem("loggedDept", userDept);
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
    if (document.getElementById("resetloginform")) {
      document.getElementById("resetloginform").click();
      app.dialog.close();
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      document.getElementById(localStorage.getItem("loggedDept")).click();
      setTimeout(() => {
        switch (localStorage.getItem("loggedDept")) {
          case "amb":
            getAmbData(user.uid);
            document.getElementById(
              "userNameA"
            ).innerText = localStorage.getItem("userNameA");
            document.getElementById(
              "userBranchA"
            ).innerText = localStorage.getItem("userBranchA");
            document.getElementById(
              "vehicleNumber"
            ).innerText = localStorage.getItem("vehicleNumber");
            document.getElementById("userEmailA").innerText = user.email;
            break;
          case "pol":
            getPolData(user.uid);
            document.getElementById(
              "userNameP"
            ).innerText = localStorage.getItem("userNameP");
            document.getElementById(
              "userBranchP"
            ).innerText = localStorage.getItem("userBranchP");
            document.getElementById("userEmailP").innerText = user.email;
        }
      }, 2000);
    } else {
      document.getElementById("log").click();
    }
  }
  // ...
  else {
    // User is signed out.
    // ...
    if (window.matchMedia("(display-mode: standalone)").matches) {
      document.getElementById("log").click();
    } else {
      document.getElementById("pwainstall").click();
    }
  }
});

function signUsrOut() {
  localStorage.clear();
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
function stopDataAmb() {
  runningops = false;
  db.collection("runningops").doc(userUID).delete();
  document.getElementById("startTripN").classList.add("hideMapEl");
  document.getElementById("startTripB").onclick = "startDataAmb()";
  document.getElementById("startTripB").classList.add("sheet-open");
  document.getElementById("startTripT").innerText = "START";
}
function sendDataAmb() {
  globalThis.userUID = localStorage.getItem("userUID");
  globalThis.runningops = true;
  if (app.input.validateInputs(document.getElementById("start-trip-form"))) {
    var startformData = app.form.convertToData("#start-trip-form");
    db.collection("runningops")
      .doc(userUID)
      .set({
        userName: localStorage.getItem("userNameA"),
        vehicleNumber: localStorage.getItem("vehicleNumber"),
        destination: startformData.destination,
        priority: startformData.priority,
      })
      .then(() => {
        console.log("Document successfully written to uid!");
        function rtlsuccess(pos) {
          if (runningops == true) {
            var rtlcrd = pos.coords;
            db.collection("runningops")
              .doc(userUID)
              .update({
                userLocation: new firebase.firestore.GeoPoint(
                  rtlcrd.latitude,
                  rtlcrd.longitude
                ),
              });
          }
        }
        function rtlerror(err) {
          app.dialog.alert(
            "Error logging data to server please check internet connection/ contact admin."
          );
        }
        var rtl, rtloptions;
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };
        rtl = navigator.geolocation.watchPosition(
          rtlsuccess,
          rtlerror,
          rtloptions
        );
      })
      .catch((error) => {
        // console.error("Error writing document: ", error);
      });
    document.getElementById("startTripB").classList.remove("sheet-open");
    document.getElementById("startTripT").innerText = "STOP";
    document
      .getElementById("startTripB")
      .setAttribute("onclick", "stopDataAmb()");
    document.getElementById("resetstartform").click();
    app.sheet.close(".amb-sheet");
    document.getElementById("startTripN").classList.remove("hideMapEl");
  } else {
    app.toast
      .create({
        text: "Fill the required fields with valid details!",
        closeTimeout: 2000,
      })
      .open();
  }
}
window
  .matchMedia("(display-mode: standalone)")
  .addEventListener("change", (evt) => {
    location.reload();
  });

function getAmbMap() {
  function showPosition(position) {
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
    map.once("load", function () {
      document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
      document.getElementById("startTripB").classList.remove("hideMapEl");
    });
  }
  function errorCallback(error) {
    if (error.code == error.PERMISSION_DENIED) {
      // pop up dialog asking for location
      app.dialog.alert(
        "Your Broswer / permission settings doesn't support Geolocation please troubleshoot and try again!",
        "Error"
      );
    }
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, errorCallback);
  } else {
    app.dialog.alert(
      "Your Broswer / permission settings doesn't support Geolocation please troubleshoot and try again!",
      "Error"
    );
  }
}
function recieveOPSData() {
  const rtlLocEvents = firebase.firestore().collection("runningops");
  rtlLocEvents.onSnapshot((querySnapshot) => {
    globalThis.rtlLoc = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    // events will fire here everytime data changes
    // asynchronously hence we take all data here and process it for
    // adding pointers to map.
    computeOPSData(rtlLoc);
  });
}

function sortDistance(a, b, rtlLoc) {
  rtlLoc.forEach(uid);
  function uid(dis) {
    console.log(dis.id, dis.random);
  }

}
function computeOPSData(rtlLoc) {
  navigator.geolocation.getCurrentPosition((pos) => {
    sortDistance(pos.coords.latitude, pos.coords.longitude, rtlLoc)
  });


}
/*
$$(".myclass").on("click", function () {
  alert(this.id);
  //$$(this).addClass('hello').attr('title', 'world').insertAfter('.something-else');
});*/

function getPolMap() {
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
  map.addControl(new mapboxgl.ScaleControl({ position: "bottom-right" }));

  map.once("load", function () {
    document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
    document.getElementById("nearPolL").classList.remove("hideMapEl");
    document.getElementById("nearPolB").classList.remove("hideMapEl");
    recieveOPSData();
  });
}
