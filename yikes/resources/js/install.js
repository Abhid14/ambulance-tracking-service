var app = new Framework7({ id: "ml.abhishekdas", root: "#app", theme: "md" }),
  $$ = Dom7;
$$(".submit-user-data").on("click", function () {
  if (
    ((userData = app.form.convertToData("#user-data-form")),
    0 !== userData.password.length && userData.password == userData.pconfirm)
  )
    swiper.slideNext();
  else {
    var a = app.toast.create({
      text: "Password entered do not match. Please try again !",
      horizontalPosition: "center",
      closeTimeout: 2e3,
    });
    a.open(), document.getElementById("resetuserform").click();
  }
}),
  $$(".submit-inst-data").on("click", function () {
    (instData = app.form.convertToData("#inst-data-form")),
      swiper.slideNext(),
      app.progressbar.show();
  }),
  eel.expose(dUPB);
function dUPB() {
  var a = document.getElementById("installUP");
  a.classList.add("disabled"), (a.innerText = "Done!");
}
function approveData() {
  app.progressbar.hide(),
    app.preloader.show(),
    eel.installDB(userData, instData);
}
eel.expose(installSuccess);
function installSuccess() {
  app.preloader.hide(), swiper.slideNext();
}
function startApp() {
  eel.restartApp();
}
function setbackProfile() {
  var a = document.getElementById("installUP");
  a.classList.remove("disabled"), (a.innerText = "Select your profile picture");
  var b = document.getElementById("installIP");
  b.classList.remove("disabled"),
    (b.innerText = "Select a picture of the institute to display");
}
eel.expose(closeInstall);
function closeInstall() {
  window.close();
}
eel.expose(dIPB);
function dIPB() {
  var a = document.getElementById("installIP");
  a.classList.add("disabled"), (a.innerText = "Done!");
  var b = app.popup.create({
    content:
      '<div class="popup" style="install-screen"><div class="block"><h1>Please verify the details</h1><h1>User information</h1><h2>Name: ' +
      `${userData.firstName}` +
      " " +
      `${userData.lastName}` +
      "</h2><h2>Email:  " +
      `${userData.email}` +
      "</h2><h2>Phone number: " +
      `${userData.phoneNumber}` +
      "</h2><h1>Institute's information</h1><h2>Institute: " +
      `${instData.instName}` +
      "</h2><h2>City: " +
      `${instData.instCity}` +
      "</h2><h2>Pin code: " +
      `${instData.instPIN}` +
      "</h2><h2>Email: " +
      `${instData.instEmail}` +
      '</h2><div class="row"><div class="col"><button class="button button-fill button-large popup-close" onclick="swiper.slidePrev();swiper.slidePrev();setbackProfile()">Fill again</button></div><div class="col"><button class="button button-fill button-large popup-close" onclick="approveData();">Approve</button></div></div></div></div>',
  });
  b.open();
}
