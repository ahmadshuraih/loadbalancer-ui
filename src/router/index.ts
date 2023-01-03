import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/security/LoginView.vue";
import TenantDetailsView from "../views/tenants/TenantDetailsView.vue";
import TenantsListView from "../views/tenants/TenantsListView.vue";
import ServerDetailsView from "../views/servers/ServerDetailsView.vue";
import ServersListView from "../views/servers/ServersListView.vue";
import SecurityView from "../views/security/SecurityView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import securityConfig from "@/functions/security/securityConfig";
import developerToolsFunctions from "@/functions/security/developerToolsFunctions";

Vue.use(VueRouter);

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
    path: "/tenants/:tenantId/:tenantType",
    name: "tenantdetails",
    component: TenantDetailsView,
    props: true,
  },
  {
    path: "/tenants",
    name: "tenants",
    component: TenantsListView,
  },
  {
    path: "/server/:serverIndex",
    name: "serverdetails",
    component: ServerDetailsView,
    props: true,
  },
  {
    path: "/servers",
    name: "servers",
    component: ServersListView,
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
  developerToolsFunctions.enableViewSourceCodeOnBrowser((to.name !== "security"));
  if (!securityConfig.isLoggedIn() && to.name !== "login") {
    if (from.name !== "login") router.push({ name: "login" });
  } else {
    next();
  }
});

export default router;
