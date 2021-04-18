(app_view = document.getElementById("app-view")),
  startTime(),
  (login_stat = void 0);
var $$ = Dom7,
  app = new Framework7({
    id: "live.abhishekdas",
    root: "#app",
    theme: "md",
    routes,
    routes,
  });
eel.sendloginPage(), eel.expose(loginPage);
function loginPage(b) {
  (firstName = b),
    (loginScreen = app.loginScreen.create({
      content:
        '<div class="login-screen"><div class="view"><div class="page login-screen-css"><div class="loginstatus"></div><div class="page-content login-screen-content"><div class="login-screen-title"><h2>Welcome back ' +
        `${firstName}` +
        '</h2></div><form id="password-form"><div class="list"><ul><li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-floating-label">Password</div><div class="item-input-wrap"> <input id="passwordField" type="password" name="userPassword" required validate data-error-message="Enter a vaild password" data-validate-on-blur="true" placeholder="Your password"></div><input type="reset" style="display: none;" id="resetuserpassword"></div></li></ul></div></form><div class="list"><ul><li><button onclick="submitpasswordB()" class="button list-button">Sign In</button></li></ul><div class="block-footer"><h2>Pygranthalaya | Library Managament Software</h2></div></div></div></div></div></div>',
      on: {
        closed: function () {
          app_view.classList.remove("user-login");
        },
      },
    })),
    loginScreen.open();
}
var passwordError = app.toast.create({
  text: "Wrong password. Try again!",
  horizontalPosition: "center",
  closeTimeout: 2e3,
});
eel.expose(triggerpasswordError);
function triggerpasswordError() {
  passwordError.open(), document.getElementById("resetuserpassword").click();
}
function submitpasswordB() {
  var b = app.form.convertToData("#password-form");
  0 === b.userPassword.length
    ? triggerpasswordError()
    : null == login_stat
    ? eel.submituserPassword(b.userPassword, 1)
    : eel.submituserPassword(b.userPassword, 13);
}
eel.expose(triggerpasswordSuccess);
function triggerpasswordSuccess(i, a, b, c, d, e, f, g) {
  document.getElementById("resetuserpassword").click(),
    (userName = i),
    (document.getElementById("instN").innerText = `${a}`),
    (document.getElementById("instA").innerText = `${b}` + " - " + `${c}`),
    (document.getElementById("instE").innerText = `${d}`),
    (document.getElementById("libT").innerText = "Total Titles : " + `${e}`),
    (document.getElementById("libC").innerText = "Total Copies : " + `${f}`),
    (document.getElementById("libM").innerText = "Library Members : " + `${g}`),
    (document.getElementById("userN").innerText =
      "Administrator : " + `${userName}`),
    (login_stat = 2),
    (profileB = app.actions.create({
      buttons: [
        [
          { text: userName + " - signed in", bold: !0 },
          {
            text: "Sign out",
            onClick: function () {
              loginScreen.open();
            },
            bold: !0,
          },
        ],
        [{ text: "Cancel", color: "red" }],
      ],
    })),
    $$(".profileB").on("click", function () {
      profileB.open();
    }),
    loginScreen.close();
}
$$(".toggleStat").on("click", function () {
  $$(".libStats").toggleClass("display-none");
}),
  eel.expose(operationSuccessMsg);
function operationSuccessMsg(a) {
  1 == a &&
    ($$(".opt-db").toggleClass("color-green"),
    app.toast
      .create({
        text: "Optimization Successfull!",
        horizontalPosition: "center",
        closeTimeout: 4e3,
      })
      .open()),
    2 == a &&
      ($$(".bkp-db").toggleClass("color-green"),
      app.toast
        .create({
          text: "Backup Successfull!",
          horizontalPosition: "center",
          closeTimeout: 4e3,
        })
        .open()),
    3 == a &&
      (app.dialog.close(),
      $$(".conv-db").toggleClass("color-green"),
      app.toast
        .create({
          text: "Export Successfull!",
          horizontalPosition: "center",
          closeTimeout: 4e3,
        })
        .open());
}
var addTitleDataError = app.toast.create({
    text:
      "Fill ACC number and Title they cannot be empty and ACC number has to be unique!",
    horizontalPosition: "center",
    closeTimeout: 4e3,
  }),
  addTitleDataSuccess = app.toast.create({
    text: "Title successfully saved to database!",
    horizontalPosition: "center",
    closeTimeout: 2e3,
  });
eel.expose(triggeraddTitleDataError);
function triggeraddTitleDataError() {
  addTitleDataError.open(), document.getElementById("resetadtform").click();
  var b = new Date();
  addTitleDate.setValue([b]), app.progressbar.hide();
}
eel.expose(triggeraddTitleDataSuccess);
function triggeraddTitleDataSuccess(e, a, b) {
  (document.getElementById("libT").innerText = "Total Titles : " + `${e}`),
    (document.getElementById("libC").innerText = "Total Copies : " + `${a}`),
    (document.getElementById("libM").innerText = "Library Members : " + `${b}`);
  var c = new Date();
  addTitleDate.setValue([c]),
    addTitleDataSuccess.open(),
    app.progressbar.hide();
}
var addMembersDataSuccess = app.toast.create({
    text: "Member successfully saved to database!",
    horizontalPosition: "center",
    closeTimeout: 2e3,
  }),
  addMembersDataError = app.toast.create({
    text:
      "Fill all the fileds with accurate data and the member may already exist with the same UID!",
    horizontalPosition: "center",
    closeTimeout: 2e3,
  });
eel.expose(triggeraddMembersDataError);
function triggeraddMembersDataError() {
  addMembersDataError.open(),
    document.getElementById("resetadmform").click(),
    app.progressbar.hide();
}
eel.expose(triggeraddMembersDataSuccess);
function triggeraddMembersDataSuccess(e, a, b, c) {
  (document.getElementById("libT").innerText = "Total Titles : " + `${a}`),
    (document.getElementById("libC").innerText = "Total Copies : " + `${b}`),
    (document.getElementById("libM").innerText = "Library Members : " + `${c}`),
    addMembersDataSuccess.open(),
    app.dialog
      .create({
        title: "The UID of the added member is : " + e,
        buttons: [{ text: "OK" }],
      })
      .open(),
    app.progressbar.hide();
}
var addTitleDate = app.calendar.create({
  inputEl: "#add-title-date",
  dateFormat: "dd/mm/yyyy",
});
function submitadm() {
  (addMembersData = app.form.convertToData("#add-members-form")),
    0 !== addMembersData.LADMID.length && 0 !== addMembersData.LNAME.length
      ? (eel.submitaddMembersData(
          addMembersData.LADMID,
          addMembersData.LNAME,
          addMembersData.LCLASS,
          addMembersData.LSECTION,
          addMembersData.LEMID
        ),
        document.getElementById("resetadmform").click())
      : triggeraddMembersDataError();
}
function titleDetails(d, a, b) {
  app.dialog
    .create({
      title: "Details",
      text:
        "The book was accessioned on : " + a + " and has ISBN number : " + b,
      buttons: [
        {
          text: "DELETE TITLE",
          onClick: function () {
            app.progressbar.show(), eel.deleteTitle(d);
          },
        },
        { text: "OK" },
      ],
    })
    .open();
}
eel.expose(queryTitlesTable);
function queryTitlesTable(b) {
  1 == b
    ? (titlesTable = $("#query-titles").DataTable())
    : (titlesTable.destroy(), titlesTable.destroy());
}
eel.expose(fillTitlesHead);
function fillTitlesHead() {
  (titlesTableHead = document.getElementById("query-titles-table")),
    (titlesTableHead.innerHTML +=
      '<table id="query-titles"><thead class="elevation-1"><tr id="query-titles-head"><th class="label-cell">ACCNO</th><th class="label-cell">ISSUED</th><th class="label-cell medium-only">TITLE</th><th class="label-cell medium-only">AUTHOR</th><th class="label-cell">TYPE</th><th class="label-cell">COPIES</th><th class="label-cell">DETAILS</th></tr></thead><tbody id="query-titles-body"></tbody></table>');
}
eel.expose(fillTitlesBody);
function fillTitlesBody(i, a, b, c, d, e, f, g) {
  (titlesTableBody = document.getElementById("query-titles-body")),
    (LACCDATE = `'${f}'`),
    (LISBN = `'${g}'`),
    (titlesTableBody.innerHTML +=
      '<td class="label-cell">' +
      `${i}` +
      "</td><td>" +
      `${a}` +
      '</td><td class="label-cell medium-only">' +
      `${b}` +
      '</td><td class="label-cell medium-only">' +
      `${c}` +
      "</td><td>" +
      `${d}` +
      "</td><td>" +
      `${e}` +
      '</td><td><i class="icon material-icons button" onclick="titleDetails(' +
      i +
      "," +
      LACCDATE +
      "," +
      LISBN +
      ')">info</i></td>');
}
eel.expose(queryMembersTable);
function queryMembersTable(b) {
  1 == b
    ? (membersTable = $("#query-members").DataTable())
    : (membersTable.destroy(), membersTable.destroy());
}
function memberDetails(e, a, b, c) {
  app.dialog
    .create({
      title: "Details",
      text: "Name : " + a + ". Admission number: " + c + ". Class: " + b,
      buttons: [
        {
          text: "REMOVE",
          onClick: function () {
            app.progressbar.show(), eel.deleteMember(e);
          },
        },
        { text: "OK" },
      ],
    })
    .open();
}
eel.expose(fillMembersHead);
function fillMembersHead() {
  (membersTableHead = document.getElementById("query-members-table")),
    (membersTableHead.innerHTML +=
      '<table id="query-members"><thead class="elevation-1"><tr id="query-members-head"><th class="label-cell">UID</th><th class="label-cell medium-only">NAME</th><th class="label-cell">CLASS</th><th class="label-cell medium-only">EMAIL-ID</th><th class="label-cell">DETAILS</th></tr></thead><tbody id="query-members-body"></tbody></table>');
}
eel.expose(fillMembersBody);
function fillMembersBody(f, a, b, c, d) {
  (membersTableBody = document.getElementById("query-members-body")),
    (NAME = `'${a}'`),
    (LCLASS = `'${b}'`),
    (membersTableBody.innerHTML +=
      '<td class="label-cell">' +
      `${f}` +
      '</td><td class="label-cell medium-only">' +
      `${a}` +
      '</td><td class="label-cell">' +
      `${b}` +
      '</td><td class="label-cell medium-only">' +
      `${c}` +
      '</td><td><i class="icon material-icons button" onclick="memberDetails(' +
      f +
      "," +
      NAME +
      "," +
      LCLASS +
      "," +
      d +
      ')">info</i></td>');
}
eel.expose(deleteMemberError);
function deleteMemberError(b) {
  1 == b &&
    (delMMsg =
      "Member has not yet returned some Titles. Submit Title and try again!"),
    2 == b && (delMMsg = "Error removing Member - database error occured!"),
    app.dialog
      .create({ title: "Details", text: delMMsg, buttons: [{ text: "OK" }] })
      .open(),
    app.progressbar.hide();
}
eel.expose(deleteMemberSuccess);
function deleteMemberSuccess() {
  app.progressbar.hide(),
    app.toast
      .create({
        text: "Member was successfully removed from records!",
        horizontalPosition: "center",
        closeTimeout: 4e3,
      })
      .open();
}
eel.expose(deleteTitleError);
function deleteTitleError(b) {
  1 == b &&
    (delTMsg =
      "Title currently in circulation. Please submit title and try again!"),
    2 == b && (delTMsg = "Error removing Title - database error occured!"),
    app.dialog
      .create({ title: "Error!", text: delTMsg, buttons: [{ text: "OK" }] })
      .open(),
    app.progressbar.hide();
}
eel.expose(deleteTitleSuccess);
function deleteTitleSuccess() {
  app.progressbar.hide(),
    app.toast
      .create({
        text: "Title was successfully removed from records!",
        horizontalPosition: "center",
        closeTimeout: 4e3,
      })
      .open();
}
eel.expose(queryReturnsTable);
function queryReturnsTable(b) {
  1 == b
    ? (returnsTable = $("#pending-returns").DataTable())
    : (returnsTable.destroy(), returnsTable.destroy());
}
eel.expose(showLoadingBar);
function showLoadingBar() {
  app.progressbar.show();
}
eel.expose(hideLoadingBar);
function hideLoadingBar() {
  app.progressbar.hide();
}
function returnTitle(b) {
  app.dialog
    .create({
      title: "Submit Title ?",
      buttons: [
        {
          text: "SUBMIT",
          onClick: function () {
            app.progressbar.show(), eel.submitTitle(b);
          },
        },
        { text: "CANCEL" },
      ],
    })
    .open();
}
eel.expose(fillReturneesHead);
function fillReturneesHead() {
  (returneesTableHead = document.getElementById("query-pending-returns-table")),
    (returneesTableHead.innerHTML +=
      '<table id="pending-returns"><thead class="elevation-1"><tr><th class="label-cell">USER ID</th><th class="label-cell">ACC NUMBER</th><th class="label-cell medium-only">TITLE</th><th class="label-cell medium-only">MEMBER NAME</th><th class="label-cell">CLASS</th><th class="numeric-cell">SUBMIT</th></tr></thead><tbody id="query-pending-returns-body"></tbody></table>');
}
eel.expose(fillReturneesBody);
function fillReturneesBody(f, a, b, c, d) {
  (returneesTableBody = document.getElementById("query-pending-returns-body")),
    (returneesTableBody.innerHTML +=
      '<td class="label-cell">' +
      `${f}` +
      '</td><td class="label-cell">' +
      `${a}` +
      '</td><td class="label-cell medium-only">' +
      `${b}` +
      '</td><td class="label-cell medium-only">' +
      `${c}` +
      '</td><td class="label-cell">' +
      `${d}` +
      '</td><td class="numeric-cell"><i class="icon material-icons button" onclick="returnTitle(' +
      a +
      ')">check</i></td>');
}
eel.expose(submitTitleError);
function submitTitleError(b) {
  1 == b && (subTMsg = "Please enter a valid ACCNO"),
    2 == b &&
      (subTMsg =
        "Title doesn't exist in circulation. Please check the details!"),
    3 == b && (subTMsg = "Database error from server couln't submit Title!"),
    app.progressbar.hide(),
    app.dialog
      .create({ title: "Error", text: subTMsg, buttons: [{ text: "OK" }] })
      .open();
}
eel.expose(submitTitleSuccess);
function submitTitleSuccess() {
  app.progressbar.hide(),
    app.toast
      .create({
        text: "Submission successful !",
        horizontalPosition: "center",
        closeTimeout: 4e3,
      })
      .open();
}
function submitadt() {
  app.progressbar.show();
  try {
    addTitleDate.formatValue();
  } catch {
    var b = new Date();
    addTitleDate.setValue([b]);
  }
  (LACCDATE = addTitleDate.formatValue()),
    (LNOC = app.stepper.getValue(".adtnoc")),
    (addTitleData = app.form.convertToData("#add-title-form")),
    0 !== addTitleData.LACCNO.length && 0 !== addTitleData.LTITLE.length
      ? (eel.submitaddTitleData(
          addTitleData.LACCNO,
          addTitleData.LTITLE,
          addTitleData.LAUTHOR,
          addTitleData.LISBN,
          LACCDATE,
          addTitleData.LTYPE,
          LNOC
        ),
        document.getElementById("resetadtform").click(),
        stepper.setValue(1))
      : triggeraddTitleDataError();
}
eel.expose(issueTitleError);
function issueTitleError(b) {
  (iTMsg =
    1 === b
      ? "Please enter the required values properly!"
      : 2 === b
      ? "Error Title not found. Please check the details!"
      : 3 === b
      ? "Error Member not found. Please check the details!"
      : 4 === b
      ? "The title is already in Circulation! Cannot issue unitl returned!"
      : 5 === b
      ? "The Member is already in Circulation! Cannot issue unitl returned!"
      : 6 === b
      ? "Database error from server couln't issue Title!"
      : "Unknown error occured please check values!"),
    app.progressbar.hide(),
    app.dialog
      .create({ title: "Error", text: iTMsg, buttons: [{ text: "OK" }] })
      .open();
}
eel.expose(issueTitleSuccess);
function issueTitleSuccess() {
  app.progressbar.hide(),
    app.toast
      .create({
        text: "Issue successful !",
        horizontalPosition: "center",
        closeTimeout: 4e3,
      })
      .open();
}
$$(".issue-title").on("click", function () {
  app.dialog.login("Enter UID and ACCNO", "Issue a Title", function (c, a) {
    app.progressbar.show(),
      0 !== c.length && 0 !== a.length
        ? eel.issueTitle(c, a)
        : issueTitleError(1);
  });
}),
  $$(".return-title").on("click", function () {
    app.dialog.password("Enter ACCNO", "Return Title", function (b) {
      0 === b.length ? submitTitleError(1) : eel.submitTitle(b);
    });
  });
var stepper = app.stepper.get(".stepper");
function startTime() {
  var e = new Date(),
    a = e.getHours(),
    b = e.getMinutes(),
    f = e.getSeconds();
  (b = checkTime(b)),
    (f = checkTime(f)),
    (document.getElementById("timeDisplayH").innerHTML = a + ":" + b + ":" + f),
    (document.getElementById("timeDisplayR").innerHTML = a + ":" + b + ":" + f),
    (document.getElementById("timeDisplayC").innerHTML = a + ":" + b + ":" + f),
    setTimeout(startTime, 500);
}
function checkTime(b) {
  return 10 > b && (b = "0" + b), b;
}
eel.expose(triggerChangeSuccess);
function triggerChangeSuccess(d, a, b) {
  (document.getElementById("libT").innerText = "Total Titles : " + `${d}`),
    (document.getElementById("libC").innerText = "Total Copies : " + `${a}`),
    (document.getElementById("libM").innerText = "Library Members : " + `${b}`);
}
function convExcel() {
  app.dialog
    .create({
      title:
        "This will export database to Excel sheets and will remove existing files created earlier. This process may take a long time depending on amount of data in the system and will pause your application till task ends. Backup old files if needed before continuing! Do you want to continue ?",
      buttons: [
        {
          text: "Yes",
          onClick: function () {
            app.dialog.progress("Exporting Data"), eel.convExcel();
          },
        },
        { text: "Cancel" },
      ],
    })
    .open(),
    app.progressbar.hide();
}
eel.expose(operationErrorMsg);
function operationErrorMsg() {
  app.dialog.close();
  app.dialog
    .create({
      title:
        "Error ! Couldn't export data please close any open Excel file and try again!",
      buttons: [{ text: "OK" }],
    })
    .open();
}
