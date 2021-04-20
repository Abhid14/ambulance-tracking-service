import HomePage from "../pages/home.f7.html";
import LoginPage from "../pages/login.f7.html";
import NotFoundPage from "../pages/404.f7.html"; 
import AmbPage from "../pages/ambulance.f7.html";
import PolPage from "../pages/police.f7.html";

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/login/",
    component: LoginPage,
  },
  {
    path: "/ambulance/",
    component: AmbPage,
  },
  {
    path: "/police/",
    component: PolPage,
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
