var routes = [
  { path: "/", url: "./index.html", name: "home" },
  { path: "/index.html", url: "./index.html"},
  { path: "/login/", url: "./pages/login.f7.html", name: "login" },
  { path: "/ambulance/", url: "./pages/ambulance.f7.html", name: "ambulance" },
  { path: "/police/", url: "./pages/police.f7.html", name: "police" },
  { path: "/color-themes/", componentUrl: "./pages/color-themes.html" },
  { path: "(.*)", url: "./pages/404.f7.html" },
];
