/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";

// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Customer from "views/Customer/Customer.js";
import Menu from "views/Menu/Menu.js";
import Offer from "views/Offer/Offer.js";
import FlatOffer from "views/FlatOffer/FlatOffer.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import Category from "views/Categories/Category";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/customers",
    name: "Customers",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: Customer,
    layout: "/admin",
  },
  {
    path: "/offers",
    name: "Offers",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: Offer,
    layout: "/admin",
  },
  {
    path: "/flatoffers",
    name: "Flat Offers",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: FlatOffer,
    layout: "/admin",
  },
  {
    path: "/menu",
    name: "Menus",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Menu,
    layout: "/admin",
  },
  {
    path: "/category",
    name: "Category",
    rtlName: "الرموز",
    icon: Person,
    component: Category,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    rtlName: "الرموز",
    icon: Person,
    component: UserProfile,
    layout: "/admin",
  },
];

export default dashboardRoutes;
