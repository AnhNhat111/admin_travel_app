/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import ProductManagement from "views/examples/ProductManagement";
import Login from "views/examples/Login";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/UserManagement",
    name: "User Management",
    icon: "ni ni-planet text-blue",
    component: ProductManagement,
    layout: "/admin",
  },
  {
    path: "/product-management",
    name: "Product Management",
    icon: "ni ni-pin-3 text-orange",
    component: ProductManagement,
    layout: "/admin",
  },
  {
    path: "/TourManagement",
    name: "Tour Management",
    icon: "ni ni-bullet-list-67 text-red",
    component: ProductManagement,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },

];
export default routes;
