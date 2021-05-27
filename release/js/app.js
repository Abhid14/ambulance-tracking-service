function signUsrOut(){localStorage.clear(),firebase.auth().signOut().catch(function(e){if("auth/network-request-failed"==e.code)var t="Network error! Please check your connection.";else t="Error signing out! Please try again";app.toast.create({text:t,closeTimeout:3e3}).open()})}function getPolData(e){$$(document).on("page:afterin",'.page[data-name="police"]',function(t){if(localStorage.getItem("userUID")!=e.uid){app.dialog.preloader("Fetching Profile Data..."),db.collection("users").doc("police").collection("accounts").doc(e.uid).get().then(t=>{t.exists?(policeData=t.data(),localStorage.setItem("userUID",e.uid),localStorage.setItem("userNameP",policeData.userName),localStorage.setItem("userBranchP",policeData.userBranch),location.reload()):(app.dialog.close(),app.dialog.alert("User data doesn't exists / missing from the server please contact your administrator!","Error",signUsrOut))}).catch(e=>{console.log("Error getting document:",e.code)})}else document.getElementById("userNameP").innerText=localStorage.getItem("userNameP"),document.getElementById("userBranchP").innerText=localStorage.getItem("userBranchP"),document.getElementById("userEmailP").innerText=e.email,getPolMap()})}function getAmbData(e){$$(document).on("page:afterin",'.page[data-name="ambulance"]',function(t){if(localStorage.getItem("userUID")!=e.uid){app.dialog.preloader("Fetching Profile Data..."),db.collection("users").doc("ambulance").collection("accounts").doc(e.uid).get().then(t=>{t.exists?(ambulanceData=t.data(),localStorage.setItem("userUID",e.uid),localStorage.setItem("userNameA",ambulanceData.userName),localStorage.setItem("userBranchA",ambulanceData.userBranch),localStorage.setItem("vehicleNumber",ambulanceData.vehicleNumber),localStorage.setItem("phoneNumber",ambulanceData.phoneNumber),location.reload()):(app.dialog.close(),app.dialog.alert("User data doesn't exists / missing from the server please contact your administrator!","Error",signUsrOut))}).catch(e=>{console.log("Error getting document:",e.code)})}else document.getElementById("userNameA").innerText=localStorage.getItem("userNameA"),document.getElementById("userBranchA").innerText=localStorage.getItem("userBranchA"),document.getElementById("vehicleNumber").innerText=localStorage.getItem("vehicleNumber"),document.getElementById("userEmailA").innerText=e.email,getAmbMap()})}function getNext(){globalThis.swiper=document.querySelector(".swiper-container").swiper,swiper.allowTouchMove=!1,swiper.slideNext()}function setDept(e){switch(globalThis.userDept=e,e){case"amb":document.getElementById("deptImage").innerHTML="<img class='appstatusf' style='height: 150px; width: 150px; border-radius: 50%' src = '../static/icons/logo-256.png' />";break;case"pol":document.getElementById("deptImage").innerHTML="<img class='appstatusf' style='height: 150px; width: 150px; border-radius: 50%' src = '../static/icons/police.jpg' />"}swiper.slideNext()}function signIn(){if(app.input.validateInputs(document.getElementById("login-form"))){app.dialog.preloader("Signing In...");var e=app.form.convertToData("#login-form");firebase.auth().signInWithEmailAndPassword(e.email,e.password).then(()=>{localStorage.setItem("loggedDept",userDept)}).catch(function(e){if(app.dialog.close(),"auth/network-request-failed"==e.code)var t="Network error! Please check your connection.";else t="Invalid Email/Password! Try again.";app.toast.create({text:t,closeTimeout:3e3}).open()})}else app.toast.create({text:"Fill the required fields with valid details!",closeTimeout:2e3}).open()}function stopDataAmb(){runningops=!1,db.collection("runningops").doc(userUID).delete(),document.getElementById("startTripN").classList.add("hideMapEl"),document.getElementById("startTripB").onclick="startDataAmb()",document.getElementById("startTripB").classList.add("sheet-open"),document.getElementById("startTripT").innerText="START",map.removeLayer("path"),map.removeSource("path")}function sendDataAmb(){globalThis.userUID=localStorage.getItem("userUID"),globalThis.runningops=!0;var e=!0,t=[],a=new XMLHttpRequest;if(a.onreadystatechange=function(){if(4==this.readyState&&200==this.status){0==e?(t=[],map.removeLayer("path"),map.removeSource("path")):e=!1;var a=JSON.parse(this.response);for(i in a.routes[0].geometry.coordinates)t.push(a.routes[0].geometry.coordinates[i]);t.push(ambDest);var o=turf.lineString(t);map.addSource("path",{type:"geojson",data:o}),map.addLayer({id:"path",type:"line",source:"path",layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":"#34FF33","line-width":6}})}},app.input.validateInputs(document.getElementById("start-trip-form"))){document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click();var o=app.form.convertToData("#start-trip-form");navigator.geolocation.getCurrentPosition(e=>{var n=[e.coords.longitude,e.coords.latitude];t.push(n),db.collection("runningops").doc(userUID).delete(),db.collection("runningops").doc(userUID).set({userName:localStorage.getItem("userNameA"),vehicleNumber:localStorage.getItem("vehicleNumber"),destination:[o.destination,new firebase.firestore.GeoPoint(ambDest[1],ambDest[0])],priority:+o.priority,userLocation:new firebase.firestore.GeoPoint(n[1],n[0]),phoneNumber:localStorage.getItem("phoneNumber")}).then(()=>{var e;e={enableHighAccuracy:!0,maximumAge:0},navigator.geolocation.watchPosition(function(e){1==runningops&&(n=[e.coords.longitude,e.coords.latitude],setTimeout(function(){db.collection("runningops").doc(userUID).update({userLocation:new firebase.firestore.GeoPoint(n[1],n[0])});var e="https://api.mapbox.com/directions/v5/mapbox/driving-traffic/"+n[0]+","+n[1]+";"+ambDest[0]+","+ambDest[1]+"?geometries=geojson&access_token=pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw";a.open("GET",e,!0),a.send()},2500))},function(e){console.log("Error logging data to server! please check internet connection/ contact admin.")},e)}).catch(e=>{})}),document.getElementById("startTripB").classList.remove("sheet-open"),document.getElementById("startTripT").innerText="STOP",document.getElementById("startTripB").setAttribute("onclick","stopDataAmb()"),document.getElementById("resetstartform").click(),app.sheet.close(".amb-sheet"),document.getElementById("startTripN").classList.remove("hideMapEl")}else app.toast.create({text:"Fill the required fields with valid details!",closeTimeout:2e3}).open()}function getAmbMap(){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){mapboxgl.accessToken="pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw",globalThis.map=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:[78.31332119498711,21.80992239473943],zoom:3}),map.addControl(new mapboxgl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0}));var t=new MapboxGeocoder({accessToken:mapboxgl.accessToken,mapboxgl:mapboxgl});document.getElementById("geocoder").appendChild(t.onAdd(map)),map.once("load",function(){document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click(),document.getElementById("startTripB").classList.remove("hideMapEl"),document.getElementsByClassName("mapboxgl-ctrl-geocoder--button")[0].remove(),document.getElementsByClassName("mapboxgl-ctrl-geocoder--icon")[0].remove();var e=document.getElementsByClassName("mapboxgl-ctrl-geocoder--input")[0];e.setAttribute("required",""),e.setAttribute("validate",""),e.setAttribute("id","destination"),e.setAttribute("name","destination")})},function(e){e.code==e.PERMISSION_DENIED&&app.dialog.alert("Your Broswer / permission settings doesn't support Geolocation please troubleshoot and try again!","Error")}):app.dialog.alert("Your Broswer / permission settings doesn't support Geolocation please troubleshoot and try again!","Error")}function getPolMap(){mapboxgl.accessToken="pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw",globalThis.map=new mapboxgl.Map({container:"map",style:"mapbox://styles/mapbox/streets-v11",center:[78.31332119498711,21.80992239473943],zoom:3}),map.addControl(new mapboxgl.GeolocateControl({positionOptions:{enableHighAccuracy:!0},trackUserLocation:!0})),map.once("load",function(){map.addControl(new MapboxTraffic),document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click(),document.getElementById("nearPolL").classList.remove("hideMapEl"),document.getElementById("nearPolB").classList.remove("hideMapEl"),globalThis.nearPolL=document.getElementById("nearPolL"),globalThis.nearPolT=document.getElementById("nearPolT"),recieveOPSData()})}function checkUID(e){return e[0]==this}function deg2rad(e){return e*(Math.PI/180)}function sortDistance(e,t,a,o){var n=deg2rad(a-e),i=deg2rad(o-t),r=Math.sin(n/2)*Math.sin(n/2)+Math.cos(deg2rad(e))*Math.cos(deg2rad(a))*Math.sin(i/2)*Math.sin(i/2);return 4>6371*(2*Math.atan2(Math.sqrt(r),Math.sqrt(1-r)))}function updateMarker(ix){if(0==wasFol){var exC1=ambList[ix][0]+".remove();",exC2=ambList[ix][0]+"= new mapboxgl.Marker({color: '"+ambList[ix][8][1]+"',}).setLngLat(["+ambList[ix][6]+", "+ambList[ix][5]+"]).addTo(map);";eval(exC1),eval(exC2)}}function removeMarker(id){if(ambList.length>0)try{var changeIndex=ambList.findIndex(checkUID,id);if("number"==typeof changeIndex)if(ambList.splice(changeIndex,1),0==ambList.length){runOPSListStat=0,nearPolT.innerText="No Running OPS",nearPolL.classList.remove("sheet-open","color-orange"),nearPolL.classList.add("color-green");var exC1=id+".remove();";document.getElementById(id).remove(),eval(exC1)}else{nearPolT.innerText=`${ambList.length} Running OPS`;var exC1=id+".remove();";document.getElementById(id).remove(),eval(exC1)}}catch(e){console.log(e)}}function addDetUI(usrDet){nearPolT.innerText=`${ambList.length} Running OPS`;var runLi=document.createElement("li");runLi.innerHTML=`<a id="${usrDet[0]}"class="runOPSItem item-link item-content"><div class="item-inner"><div class="item-title-row"><div class="item-title">${usrDet[1]}</div><div class="item-after"><span class="badge ${usrDet[8][0]}">${usrDet[4]}</span></div></div><div class="item-subtitle">${usrDet[2]}</div><div class="item-subtitle">${usrDet[3][0]}</div><div class="item-subtitle">${usrDet[7]}</div></div></a>`,$$(".runOPSCont").append(runLi),$$(".runOPSItem").on("click",function(){folUsr(this.id)}),eval(usrDet[0]+"= new mapboxgl.Marker({color: '"+usrDet[8][1]+"',}).setLngLat(["+usrDet[6]+", "+usrDet[5]+"]).addTo(map);"),4==usrDet[4]&&app.dialog.alert("A Green corridor vehicle has been detected in your 4 km range!","Important Alert!")}function addAmbList(e,t,a){var o=ambList.findIndex(checkUID,t);console.log(o),-1==o&&(navigator.geolocation.getCurrentPosition(a=>{if(!0===sortDistance(a.coords.latitude,a.coords.longitude,e.userLocation.latitude,e.userLocation.longitude)){switch(e.priority){case 1:var o=["color-yellow","#ffff00"];break;case 2:o=["color-orange","#ffa500"];break;case 3:o=["color-red","#ff0000"];break;case 4:o=["color-green","#33cc33"]}var n=[t,e.userName,e.vehicleNumber,e.destination,e.priority,e.userLocation.latitude,e.userLocation.longitude,e.phoneNumber,o];ambList.push(n),addDetUI(n),0==runOPSListStat&&(runOPSListStat=1,nearPolL.classList.add("sheet-open","color-orange"),0==firstSyncSuccess&&(firstSyncSuccess=!0))}else 0==firstSyncSuccess&&(firstSyncSuccess=!0)}),1==a&&app.notification.create({icon:'<i class="material-icons md-only">warning</i>',title:"Attention",titleRightText:"now",subtitle:"An ambulance has been detected in your range!",text:"Driver: "+change.doc.data().userName+" Vehicle Number: "+change.doc.data().vehicleNumber,closeTimeout:3e3}).open())}function folUsr(e){1==wasFol?(document.getElementById("nearPolD").classList.add("hideMapEl"),map.removeLayer(prevFol),map.removeSource(prevFol)):(document.getElementById("nearPolF").classList.remove("hideMapEl"),globalThis.wasFol=!0);var t="pk.eyJ1IjoiYWJoaXJhbmdlcm1hcGJveCIsImEiOiJja25sNjJ4d3QwMjRzMnFsaTF2eno2Y2N0In0.R2nh61HBc6YfuLxTHO6SPw",a=ambList.findIndex(checkUID,e);document.getElementById("stopFol").setAttribute("onclick","stopFol('"+e+"')"),app.sheet.close(".pol-sheet"),map.flyTo({center:[ambList[a][6],ambList[a][5]],essential:!0});var o=[],n=[ambList[a][6],ambList[a][5]],r=new XMLHttpRequest,s=new XMLHttpRequest;r.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var e=JSON.parse(this.response);for(i in e.routes[0].geometry.coordinates)o.push(e.routes[0].geometry.coordinates[i]);o.push(n);var t=e.routes[0].distance.toString().split(".")[0];t.length>3?document.getElementById("nearPolDText").innerText=t[0]+"."+t[1]+" KM":document.getElementById("nearPolDText").innerText=t+" M",s.send()}},s.onreadystatechange=function(){if(4==this.readyState&&200==this.status){for(i in globalThis.routeDir=JSON.parse(this.response),routeDir.routes[0].geometry.coordinates)o.push(routeDir.routes[0].geometry.coordinates[i]);var t=turf.lineString(o);map.addSource(e,{type:"geojson",data:t}),map.addLayer({id:e,type:"line",source:e,layout:{"line-join":"round","line-cap":"round"},paint:{"line-color":ambList[a][8][1],"line-width":6}}),globalThis.prevFol=e,document.getElementById("nearPolD").classList.remove("hideMapEl")}},navigator.geolocation.getCurrentPosition(e=>{var i=[e.coords.longitude,e.coords.latitude];o.push(i);var c="https://api.mapbox.com/directions/v5/mapbox/driving-traffic/"+i[0]+","+i[1]+";"+n[0]+","+n[1]+"?geometries=geojson&access_token="+t;r.open("GET",c,!0);var l="https://api.mapbox.com/directions/v5/mapbox/driving-traffic/"+n[0]+","+n[1]+";"+ambList[a][3][1]._long+","+ambList[a][3][1]._lat+"?geometries=geojson&access_token="+t;r.open("GET",c,!0),s.open("GET",l,!0),r.send()})}function stopFol(e){wasFol=!1,document.getElementById("nearPolF").classList.add("hideMapEl"),app.sheet.close(".pol-sheet"),document.getElementById("nearPolD").classList.add("hideMapEl"),document.getElementById("nearPolDText").innerText="",document.getElementsByClassName("mapboxgl-ctrl-geolocate")[0].click(),map.removeLayer(e),map.removeSource(e)}function recieveOPSData(){globalThis.firstSyncSuccess=!1,globalThis.ambList=[],globalThis.runOPSListStat=0,globalThis.wasFol=!1,db.collection("runningops").onSnapshot(e=>{e.docChanges().forEach(e=>{if("added"===e.type&&addAmbList(e.doc.data(),e.doc.id),"modified"===e.type&&1==firstSyncSuccess)if(ambList.length>0)try{var t=ambList.findIndex(checkUID,e.doc.id);0>t?addAmbList(e.doc.data(),e.doc.id,!0):(ambList[t][5]=e.doc.data().userLocation.latitude,ambList[t][6]=e.doc.data().userLocation.longitude,updateMarker(t))}catch(e){console.log(e)}else addAmbList(e.doc.data(),e.doc.id,!0);"removed"===e.type&&(removeMarker(e.doc.id),map.getLayer(e.doc.id).id==e.doc.id&&stopFol(e.doc.id))})})}var $$=Dom7;app=new Framework7({id:"ambulancetracker",root:"#app",theme:"md",routes:routes}),window.matchMedia("(display-mode: standalone)").addEventListener("change",e=>{location.reload()});var firebaseConfig={apiKey:"AIzaSyD8dDiGzBMWw2JRAqdfLnHILQA0XHBFBFU",authDomain:"ambulancetrackerweb.firebaseapp.com",databaseURL:"https://ambulancetrackerweb-default-rtdb.firebaseio.com",projectId:"ambulancetrackerweb",storageBucket:"ambulancetrackerweb.appspot.com",messagingSenderId:"35818978401",appId:"1:35818978401:web:882a658ddba4816ec6fe20",measurementId:"G-C3M80W1F3Y"};firebase.initializeApp(firebaseConfig);const db=firebase.firestore();firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL),firebase.analytics(),firebase.auth().onAuthStateChanged(function(e){if(e)if(document.getElementById("resetloginform")&&(document.getElementById("resetloginform").click(),app.dialog.close()),window.matchMedia("(display-mode: standalone)").matches)switch(document.getElementById(localStorage.getItem("loggedDept")).click(),localStorage.getItem("loggedDept")){case"amb":getAmbData(e);break;case"pol":getPolData(e)}else document.getElementById("pwainstall").click();else window.matchMedia("(display-mode: standalone)").matches?document.getElementById("log").click():document.getElementById("pwainstall").click()});