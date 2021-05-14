// framework7
var $$ = Dom7;
app = new Framework7({
  id: "ambulancetracker",
  root: "#app",
  theme: "md",
  routes,
});
window.matchMedia("(display-mode: standalone)").addEventListener("change", (evt) => {
  location.reload(); // bhuilt in html method to reload page
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
      document.getElementById(localStorage.getItem("loggedDept")).click();
      switch (localStorage.getItem("loggedDept")) {
        case "amb":
          getAmbData(user); // fetch user data
          break;
        case "pol":
          getPolData(user); // fetch user data
          break;
      }
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
function getPolData(user) {
  $$(document).on("page:afterin", '.page[data-name="police"]', function (e) {
    // Do something here when page with data-name="police" attribute loaded and initialized
    if (localStorage.getItem("userUID") != user.uid) {
      app.dialog.preloader("Fetching Profile Data...");
      const query = db
        .collection("users")
        .doc("police")
        .collection("accounts")
        .doc(user.uid);
      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            policeData = doc.data();
            localStorage.setItem("userUID", user.uid);
            localStorage.setItem("userNameP", policeData.userName);
            localStorage.setItem("userBranchP", policeData.userBranch);
            location.reload();
          } else {
            app.dialog.close()
            app.dialog.alert(
              "User data doesn't exists / missing from the server please contact your administrator!",
              "Error",
              signUsrOut
            );
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error.code);
        });
    } else {
      document.getElementById("userNameP").innerText = localStorage.getItem(
        "userNameP"
      );
      document.getElementById("userBranchP").innerText = localStorage.getItem(
        "userBranchP"
      );
      document.getElementById("userEmailP").innerText = user.email;
      getPolMap();
    }
  });
}
function getAmbData(user) {
  $$(document).on("page:afterin", '.page[data-name="ambulance"]', function (e) {
    // Do something here when page with data-name="ambulance" attribute loaded and initialized
    if (localStorage.getItem("userUID") != user.uid) {
      app.dialog.preloader("Fetching Profile Data...");
      const query = db
        .collection("users")
        .doc("ambulance")
        .collection("accounts")
        .doc(user.uid);
      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            ambulanceData = doc.data(); // firestore function returns json data
            localStorage.setItem("userUID", user.uid);
            localStorage.setItem("userNameA", ambulanceData.userName);
            localStorage.setItem("userBranchA", ambulanceData.userBranch);
            localStorage.setItem("vehicleNumber", ambulanceData.vehicleNumber);
            localStorage.setItem("phoneNumber", ambulanceData.phoneNumber);
            location.reload();
          } else {
            app.dialog.close()
            app.dialog.alert(
              "User data doesn't exists / missing from the server please contact your administrator!",
              "Error",
              signUsrOut
            );
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error.code);
        });
    } else {
      document.getElementById("userNameA").innerText = localStorage.getItem(
        "userNameA"
      );
      document.getElementById("userBranchA").innerText = localStorage.getItem(
        "userBranchA"
      );
      document.getElementById("vehicleNumber").innerText = localStorage.getItem(
        "vehicleNumber"
      );
      document.getElementById("userEmailA").innerText = user.email;
      getAmbMap();
    }
  });
}
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
              setTimeout(function () {
                db.collection("runningops")
                  .doc(userUID)
                  .update({
                    userLocation: new firebase.firestore.GeoPoint(
                      rtlcrd.latitude,
                      rtlcrd.longitude
                    ),
                  });
              }, 2500);
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
            maximumAge: 0,
          };
          rtl = navigator.geolocation.watchPosition(
            rtlsuccess, // callback position lat & long
            rtlerror, // error callback
            rtloptions // additional options
          );
        })
        .catch((error) => { });
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
    globalThis.map = new mapboxgl.Map({
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
// calculation and processing part
function checkUID(usrArr) {
  if (usrArr[0] == this) {
    return true;
  } else {
    return false;
  }
}
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
// belongs to police ui
function getPolMap() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw";
  globalThis.map = new mapboxgl.Map({
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
    globalThis.nearPolL = document.getElementById("nearPolL");
    globalThis.nearPolT = document.getElementById("nearPolT");
    recieveOPSData(); // call data reciever
  });
}
function folUsr(id) {
  var ix = ambList.findIndex(checkUID, id);
  app.sheet.close(".pol-sheet");
  map.flyTo({
    center: [ambList[ix][6], ambList[ix][5]],
    essential: true,
  });
}
function addDetUI(usrDet) {
  nearPolT.innerText = `${ambList.length} Running OPS`;
  var runLi = document.createElement("li"); // dom manipulation method
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
    "]).addTo(map);"
  ); // Bjkfjkd = mapboxgl.Marker({color:'#33cc3' ,}).setLngLat(["77.77","12.77"]).addTo(map)
  if (pty == "color-green") {
    app.dialog.alert(
      "A Green corridor vehicle has been detected in your 4 km range!",
      "Important Alert!"
    );
  }
}
function updateMarker(ix) {
  switch (ambList[ix][4]) {
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
  var exC1 = (ambList[ix][0] + ".remove();").toString(); // UID
  var exC2 = (
    ambList[ix][0] +
    "= new mapboxgl.Marker({color: '" +
    pColor +
    "',}).setLngLat([" +
    ambList[ix][6] +
    ", " +
    ambList[ix][5] +
    "]).addTo(map);"
  ).toString();
  eval(exC1);
  eval(exC2);
}
function removeMarker(id) {
  if (ambList.length > 0) {
    try {
      var changeIndex = ambList.findIndex(checkUID, id);
      if (typeof changeIndex === "number") {
        ambList.splice(changeIndex, 1);
        // if no elements
        if (ambList.length == 0) {
          runOPSListStat = 0;
          nearPolT.innerText = "No Running OPS";
          nearPolL.classList.remove("sheet-open", "color-orange");
          nearPolL.classList.add("color-green");
          var exC1 = (id + ".remove();").toString();
          document.getElementById(id).remove();
          eval(exC1);
        }
        // if there are elements  then excute this
        else {
          nearPolT.innerText = `${ambList.length} Running OPS`;
          var exC1 = (id + ".remove();").toString();
          document.getElementById(id).remove();
          eval(exC1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function addAmbList(ambData, ambID) {
  navigator.geolocation.getCurrentPosition((pos) => {
    if (
      sortDistance(
        pos.coords.latitude,
        pos.coords.longitude,
        ambData.userLocation.latitude,
        ambData.userLocation.longitude
      ) === true
    ) {
      var usrDet = [
        ambID, // At index 0 this is UID of ambulance
        ambData.userName,
        ambData.vehicleNumber,
        ambData.destination,
        ambData.priority,
        ambData.userLocation.latitude,
        ambData.userLocation.longitude,
        ambData.phoneNumber,
      ];
      ambList.push(usrDet); // add data to global array
      addDetUI(usrDet); // this is used for updating ui
      if (runOPSListStat == 0) {
        runOPSListStat = 1;
        nearPolL.classList.add("sheet-open", "color-orange");
      }
    }
    if (firstSyncSuccess == false) {
      firstSyncSuccess = true;
    }
  });
}
/// data  reciever
function recieveOPSData() {
  globalThis.firstSyncSuccess = false;
  globalThis.ambList = [];
  globalThis.runOPSListStat = 0;
  db.collection("runningops").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      // when added
      if (change.type === "added") {
        addAmbList(change.doc.data(), change.doc.id);
      }
      // when location changes
      if (change.type === "modified") {
        if (firstSyncSuccess == true) {
          if (ambList.length > 0) {
            try {
              // changeIndex will be an integer if true else will be false
              var changeIndex = ambList.findIndex(checkUID, change.doc.id); // to find index
              if (changeIndex >= 0) {
                ambList[
                  changeIndex
                ][5] = change.doc.data().userLocation.latitude;
                ambList[
                  changeIndex
                ][6] = change.doc.data().userLocation.longitude;
                updateMarker(changeIndex); //
              } else {
                // here adding ambulance to our list if it suddenly enters our range
                addAmbList(change.doc.data(), change.doc.id);
              }
            } catch (error) {
              console.log(error);
            }
          } else {
            addAmbList(change.doc.data(), change.doc.id);
          }
        }
      }
      // when removed
      if (change.type === "removed") {
        removeMarker(change.doc.id);
      }
    });
  });
}