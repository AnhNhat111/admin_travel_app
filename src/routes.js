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
import TourManagement from "views/examples/TourManagement";
import UserManagement from "views/examples/UserManagement";
import LocationManagement from "views/examples/LocationManagement";
import VehicleManagement from "views/examples/VehicleManagement";
import BookingManagement from "views/examples/BookingManagement";
import Login from "./views/examples/Login";
import { IoAirplaneOutline } from "react-icons/io5";
var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: <IoAirplaneOutline />,
    component: Index,
    layout: "/admin",
    customIcon: true,
  },
  {
    path: "/login",
    component: Login,
    layout: "/auth",
  },

  {
    path: "/user-management",
    name: "User Management",
    icon: "ni ni-pin-3 text-orange",
    component: UserManagement,
    layout: "/admin",
  },
  {
    path: "/tour-management",
    name: "Tour Management",
    icon: "ni ni-pin-3 text-orange",
    component: TourManagement,
    layout: "/admin",
  },
  {
    path: "/booking-management",
    name: "Booking Management",
    icon: "ni ni-pin-3 text-orange",
    component: BookingManagement,
    layout: "/admin",
  },
  {
    path: "/vehicle-management",
    name: "Vehicle Management",
    icon: "ni ni-pin-3 text-orange",
    component: VehicleManagement,
    layout: "/admin",
  },
  {
    path: "/location-management",
    name: "Location Management",
    icon: "ni ni-pin-3 text-orange",
    component: LocationManagement,
    layout: "/admin",
  },
];
export default routes;
