var routes = [
  { path: "/", url: "./index.html", name: "home" },
  { path: "/color-themes/", componentUrl: "./pages/color-themes.html" },
  { path: "/about/", url: "./pages/about.html", name: "about" },
  { path: "/system/", url: "./pages/system.html", name: "about" },
  { path: "(.*)", url: "./pages/404.html" },
];
