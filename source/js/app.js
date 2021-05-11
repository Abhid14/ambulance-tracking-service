// framework7
var $$ = Dom7;
app = new Framework7({
  id: "ambulancetracker",
  root: "#app",
  theme: "md",
  routes,
});
// firebase init
var firebaseConfig = {
  apiKey: "AIzaSyD8dDiGzBMWw2JRAqdfLnHILQA0XHBFBFU",
  authDomain: "ambulancetrackerweb.firebaseapp.com",
  databaseURL: "https://ambulancetrackerweb-default-rtdb.firebaseio.com",
  projectId: "ambulancetrackerweb",
  storageBucket: "ambulancetrackerweb.appspot.com",
  messagingSenderId: "35818978401",
  appId: "1:35818978401:web:882a658ddba4816ec6fe20",
  measurementId: "G-C3M80W1F3Y", // google analytics
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // db instance
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firebase.analytics(); // google analytics
// All authentication and app state management
function getNext() {
  globalThis.swiper = document.querySelector(".swiper-container").swiper;
  swiper.allowTouchMove = false;
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
  if (localStorage.getItem("userUID") != uid) {
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
        } else {
          app.dialog.alert(
            "User data doesn't exists / missing from the server please contact your administrator!",
            "Error",
            signUsrOut
          );
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
}
function getAmbData(uid) {
  if (localStorage.getItem("userUID") != uid) {
    const query = db
      .collection("users")
      .doc("ambulance")
      .collection("accounts")
      .doc(uid);
    query
      .get()
      .then((doc) => {
        if (doc.exists) {
          ambulanceData = doc.data(); // firestore function returns json data
          localStorage.setItem("userUID", uid);
          localStorage.setItem("userNameA", ambulanceData.userName);
          localStorage.setItem("userBranchA", ambulanceData.userBranch);
          localStorage.setItem("vehicleNumber", ambulanceData.vehicleNumber);
          localStorage.setItem("phoneNumber", ambulanceData.phoneNumber);
        } else {
          app.dialog.alert(
            "User data doesn't exists / missing from the server please contact your administrator!",
            "Error",
            signUsrOut
          );
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
}
function signIn() {
  if (app.input.validateInputs(document.getElementById("login-form"))) {
    app.dialog.preloader("Signing In...");
    var formData = app.form.convertToData("#login-form");
    firebase
      .auth()
      .signInWithEmailAndPassword(formData.email, formData.password) //
      .then(() => {
        // successful
        localStorage.setItem("loggedDept", userDept); // sets user
      })
      .catch(function (error) {
        //
        app.dialog.close();
        if (error.code == "auth/network-request-failed") {
          var errorMsg = "Network error! Please check your connection.";
        } else {
          var errorMsg = "Invalid Email/Password! Try again.";
        }
        app.toast.create({ text: errorMsg, closeTimeout: 3000 }).open();
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
// this is executed first
firebase.auth().onAuthStateChanged(function (user) {
  // realtime authenctication listener
  // if it is logged in
  if (user) {
    // only if a login event
    if (document.getElementById("resetloginform")) {
      document.getElementById("resetloginform").click();
      app.dialog.close();
    }
    //  this is executed if the app is logged in
    if (window.matchMedia("(display-mode: standalone)").matches) {
      appHasBeenOpened = true;
      document.getElementById(localStorage.getItem("loggedDept")).click();
      setTimeout(() => {
        switch (localStorage.getItem("loggedDept")) {
          case "amb":
            getAmbData(user.uid); // fetch user data
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
            getPolData(user.uid); // fetch user data
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
      // if opened from browser
      document.getElementById("pwainstall").click();
    }
  } else {
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
      app.toast.create({ text: errorMsg, closeTimeout: 3000 }).open();
    });
}
// Main app functionality after logged in and  opened as app..
// Belongs to ambulance
function stopDataAmb() {
  runningops = false;
  db.collection("runningops").doc(userUID).delete();
  document.getElementById("startTripN").classList.add("hideMapEl");
  document.getElementById("startTripB").onclick = "startDataAmb()";
  document.getElementById("startTripB").classList.add("sheet-open");
  document.getElementById("startTripT").innerText = "START";
}
// on click start duty
function sendDataAmb() {
  globalThis.userUID = localStorage.getItem("userUID");
  globalThis.runningops = true;
  if (app.input.validateInputs(document.getElementById("start-trip-form"))) {
    var startformData = app.form.convertToData("#start-trip-form");
    navigator.geolocation.getCurrentPosition((pos) => {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      //
      db.collection("runningops").doc(userUID).delete();
      //
      db.collection("runningops")
        .doc(userUID)
        .set({
          userName: localStorage.getItem("userNameA"),
          vehicleNumber: localStorage.getItem("vehicleNumber"),
          destination: startformData.destination,
          priority: Number(startformData.priority),
          userLocation: new firebase.firestore.GeoPoint(lat, lon),
          phoneNumber: localStorage.getItem("phoneNumber"),
        })
        .then(() => {
          console.log("Document successfully written to uid!");
          //  callback
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
          // error caLL BACK
          function rtlerror(err) {
            console.log(
              "Error logging data to server! please check internet connection/ contact admin."
            );
          }
          var rtl, rtloptions;
          rtloptions = {
            enableHighAccuracy: true,
            timeout: 3500,
            maximumAge: 0,
          };
          rtl = navigator.geolocation.watchPosition(
            rtlsuccess, // callback position lat & long
            rtlerror, // error callback
            rtloptions // additional options
          );
        })
        .catch((error) => {});
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
// 1st function
function getAmbMap() {
  function showPosition(position) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw";
    var map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [78.31332119498711, 21.80992239473943],
      zoom: 3,
    });
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true, //
      })
    );
    map.once("load", function () {
      document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
      document.getElementById("startTripB").classList.remove("hideMapEl");
    });
  }
  function errorCallback(error) {
    if (error.code == error.PERMISSION_DENIED) {
      app.dialog.alert(
        "Your Broswer / permission settings doesn't support Geolocation please troubleshoot and try again!",
        "Error"
      );
    }
  }
  //
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, errorCallback);
  } else {
    app.dialog.alert(
      "Your Broswer / permission settings doesn't support Geolocation please troubleshoot and try again!",
      "Error"
    );
  }
}
// belongs to police ui
// calculation part
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function sortDistance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // d is the distance in kms
  var d = R * c;
  if (d < 4) {
    return true;
  } else {
    return false;
  }
}
// ui list part
function addAmbList(lat1, lon1, usrDet) {
  // if under 4 km
  if (sortDistance(lat1, lon1, usrDet[5], usrDet[6]) === true) {
    window.ambList.push(usrDet); // add data to global array
    addDetUI(usrDet); // this is used for updating ui
    if (window.runOPSListStat == 0) {
      window.runOPSListStat = 1;
      window.nearPolL.classList.add("sheet-open", "color-orange");
    }
  }
}
function folUsr(id) {
  function checkUIDToFol(Data) {
    if (Data[0] == id) {
      return Data;
    } else {
      return false;
    }
  }
  var ix = window.ambList.findIndex(checkUIDToFol);
  app.sheet.close(".pol-sheet");
  window.map.flyTo({
    center: [window.ambList[ix][6], window.ambList[ix][5]],
    essential: true,
  });
}
function addDetUI(usrDet) {
  window.nearPolT.innerText = `${window.ambList.length} Running OPS`;
  let runLi = document.createElement("li"); // dom manipulation method
  switch (usrDet[4]) {
    case 1:
      var pty = "color-yellow";
      var pColor = "#ffff00";
      break;
    case 2:
      var pty = "color-orange";
      var pColor = "#ffa500";
      break;
    case 3:
      var pty = "color-red";
      var pColor = "#ff0000";
      break;
    case 4:
      var pty = "color-green";
      var pColor = "#33cc33";
      break;
  }
  runLi.innerHTML = `<a id="${usrDet[0]}"class="runOPSItem item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">${usrDet[1]}</div><div class="item-after"><span class="badge ${pty}">${usrDet[4]}</span></div></div><div class="item-subtitle">${usrDet[2]}</div><div class="item-subtitle">${usrDet[3]}</div><div class="item-subtitle">${usrDet[7]}</div></div></a>`;
  $$(".runOPSCont").append(runLi);
  $$(".runOPSItem").on("click", function () {
    // realtime click event listener
    folUsr(this.id);
  });
  // we r creating markers for each ambulance
  eval(
    usrDet[0] +
      "= new mapboxgl.Marker({color: '" +
      pColor +
      "',}).setLngLat([" +
      usrDet[6] +
      ", " +
      usrDet[5] +
      "]).addTo(window.map);"
  ); // Bjkfjkd = mapboxgl.Marker({color:'#33cc3' ,}).setLngLat(["77.77","12.77"]).addTo(window.map)
  if (pty == "color-green") {
    app.dialog.alert(
      "A Green corridor vehicle " +
        userDet[2] +
        " has been detected in your 4 km range!",
      "Important Alert!"
    );
  }
}
function updateMarker(ix) {
  switch (window.ambList[ix][4]) {
    case 1:
      var pColor = "#ffff00";
      break;
    case 2:
      var pColor = "#ffa500";
      break;
    case 3:
      var pColor = "#ff0000";
      break;
    case 4:
      var pColor = "#33cc33";
      break;
  }
  var exC1 = (window.ambList[ix][0] + ".remove();").toString();
  var exC2 = (
    window.ambList[ix][0] +
    "= new mapboxgl.Marker({color: '" +
    pColor +
    "',}).setLngLat([" +
    window.ambList[ix][6] +
    ", " +
    window.ambList[ix][5] +
    "]).addTo(window.map);"
  ).toString();
  eval(exC1);
  eval(exC2);
}
/// data  reciever
function recieveOPSData() {
  ambList = [];
  runOPSListStat = 0;
  db.collection("runningops").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      // when added
      if (change.type === "added") {
        var usrDet = [
          change.doc.id, // At index 0 this is UID of ambulance
          change.doc.data().userName,
          change.doc.data().vehicleNumber,
          change.doc.data().destination,
          change.doc.data().priority,
          change.doc.data().userLocation.latitude,
          change.doc.data().userLocation.longitude,
          change.doc.data().phoneNumber,
        ];
        navigator.geolocation.getCurrentPosition((pos) => {
          addAmbList(pos.coords.latitude, pos.coords.longitude, usrDet);
        });
      }
      // when location changes
      if (change.type === "modified") {
        function checkUID(Data) {
          if (Data[0] == change.doc.id) {
            return Data;
          } else {
            return false;
          }
        }
        //
        if (window.ambList.length > 0) {
          try {
            // changeIndex will be an integer if true else will be false
            var changeIndex = window.ambList.findIndex(checkUID);
            if (typeof changeIndex === "number") {
              window.ambList[
                changeIndex
              ][5] = change.doc.data().userLocation.latitude;
              window.ambList[
                changeIndex
              ][6] = change.doc.data().userLocation.longitude;
              updateMarker(changeIndex);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      // when removed
      if (change.type === "removed") {
        function checkUIDToDel(Data) {
          if (Data[0] == change.doc.id) {
            return Data;
          } else {
            return false;
          }
        }
        if (window.ambList.length > 0) {
          try {
            var changeIndex = window.ambList.findIndex(checkUIDToDel);
            if (typeof changeIndex === "number") {
              window.ambList.splice(changeIndex, 1);
              // if no elements
              if (window.ambList.length == 0) {
                window.runOPSListStat = 0;
                window.nearPolT.innerText = "No Running OPS";
                window.nearPolL.classList.remove("sheet-open", "color-orange");
                window.nearPolL.classList.add("color-green");
                var exC1 = (change.doc.id + ".remove();").toString();
                document.getElementById(change.doc.id).remove();
                eval(exC1);
              }
              // if there are elements  then excute this
              else {
                window.nearPolT.innerText = `${window.ambList.length} Running OPS`;
                var exC1 = (change.doc.id + ".remove();").toString();
                document.getElementById(change.doc.id).remove();
                eval(exC1);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  });
}
// when user clicks load map button 1st function
function getPolMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw";
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [78.31332119498711, 21.80992239473943],
    zoom: 3,
  });
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    })
  );
  map.once("load", function () {
    document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();
    document.getElementById("nearPolL").classList.remove("hideMapEl");
    document.getElementById("nearPolB").classList.remove("hideMapEl");
    nearPolL = document.getElementById("nearPolL");
    nearPolT = document.getElementById("nearPolT");
    recieveOPSData(); // call data reciever
  });
}
window
.matchMedia("(display-mode: standalone)")
.addEventListener("change", (evt) => {
  if (appHasBeenOpened != true) {
    location.reload(); // bhuilt in html method to reload page
  }
});