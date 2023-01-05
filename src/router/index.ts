/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/security/LoginView.vue";
import TenantsListView from "../views/tenants/TenantsListView.vue";
import ServersListView from "../views/servers/ServersListView.vue";
import SecurityView from "../views/security/SecurityView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import securityConfig from "@/functions/security/securityConfig";
import developerToolsFunctions from "@/functions/security/developerToolsFunctions";
import loginFunctions from "@/functions/security/loginFunctions";

Vue.use(VueRouter);
let queue = { name: "", params: {} };

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/tenants",
    name: "tenants",
    component: TenantsListView,
  },
  {
    path: "/tenants/:tenantId",
    name: "tenantsbyid",
    component: TenantsListView,
    props: true,
  },
  {
    path: "/servers",
    name: "servers",
    component: ServersListView,
  },
  {
    path: "/servers/:serverIndex",
    name: "serversbyindex",
    component: ServersListView,
    props: true,
  },
  {
    path: "/security",
    name: "security",
    component: SecurityView,
  },
  {
    //Redirect to 404 not found page
    path: "/:catchAll(.*)",
    name: "notfound",
    component: NotFoundView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext) => {
  developerToolsFunctions.enableViewSourceCodeOnBrowser(to.name !== "security");
  if (!securityConfig.isLoggedIn() && to.name !== "login") {
    queue = { name: to.name!, params: to.params };
    if (from.name !== "login") loginFunctions.logout();
  } else if (securityConfig.isLoggedIn() && from.name !== "login" && to.name === "login") {
    loginFunctions.logout();
  } else if (securityConfig.isLoggedIn() && from.name === "login" && to.name === "home") {
    if (queue.name) {
      router.push(queue);
      queue = { name: "", params: {} };
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
