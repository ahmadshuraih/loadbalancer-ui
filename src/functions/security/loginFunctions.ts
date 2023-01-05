/* eslint-disable @typescript-eslint/no-non-null-assertion */
import router from "@/router";
import VueSimpleAlert from "vue-simple-alert";
import securityWebFacade from "../webServicesFacades/securityWebFacade";
import securityConfig from "./securityConfig";
import CryptoJS from "crypto-js";

/**
 * Returns `Promise<void>`.
 *
 * This function logs the user in and redirects to home page.
 */
async function login(username: string, password: string): Promise<void> {
  const response = await securityWebFacade.login(username, password);
  if (response.succeed) {
    const responseAuthentication = response.auth?.["fdUasd7jsdy/&9sddsaj_asdsd"];
    const responseAuthorization = response.auth?.["34as@vsdas6y/&9asd/32h^sdGJ"];
    const responseKey = response.auth?.["ry*as-sdy/&9aswd/32sddv"];
    const authenticationToken = CryptoJS.AES.decrypt(responseAuthentication!, responseKey!).toString(CryptoJS.enc.Utf8);
    const authorizationToken = CryptoJS.AES.decrypt(responseAuthorization!, responseKey!).toString(CryptoJS.enc.Utf8);
    securityConfig.setAuthenticationToken(authenticationToken);
    securityConfig.setAuthorizationToken(authorizationToken);
    securityConfig.setUsername(username);
    securityConfig.setPassword(password);
    securityConfig.setLoggedIn(true);
    router.push({ name: "home" });
    toggleNavigationBar(true);
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `void`.
 *
 * This function logs the user out and redirects to login page.
 */
function logout(): void {
  securityConfig.clearSession();
  router.push({ name: "login" });
  toggleNavigationBar(false);
}

/**
 * Returns `void`.
 *
 * This function shows/hides the navbar and the logout button when logged in/out.
 */
function toggleNavigationBar(show: boolean): void {
  if (show) {
    document.getElementById("logout-btn")?.classList.remove("hide-login");
    document.getElementById("navigation-bar")?.classList.remove("hide-login");
    document.getElementById("nav-white-model")?.classList.remove("hide-login");
    document.getElementById("nav-dark-model")?.classList.remove("hide-login");
    document.getElementById("logout-btn")?.classList.add("show-login");
    document.getElementById("navigation-bar")?.classList.add("show-login");
    document.getElementById("nav-white-model")?.classList.add("show-login");
    document.getElementById("nav-dark-model")?.classList.add("show-login");
    document.getElementById("page-content")?.classList.remove("logged-out");
  } else {
    document.getElementById("logout-btn")?.classList.remove("show-login");
    document.getElementById("navigation-bar")?.classList.remove("show-login");
    document.getElementById("nav-white-model")?.classList.remove("show-login");
    document.getElementById("nav-dark-model")?.classList.remove("show-login");
    document.getElementById("logout-btn")?.classList.add("hide-login");
    document.getElementById("navigation-bar")?.classList.add("hide-login");
    document.getElementById("nav-white-model")?.classList.add("hide-login");
    document.getElementById("nav-dark-model")?.classList.add("hide-login");
    document.getElementById("page-content")?.classList.add("logged-out");
  }
}

/**
 * Returns `void`.
 *
 * This function checks the login status and toggles the navbar and logout button.
 */
function checkLogin(): void {
  toggleNavigationBar(securityConfig.isLoggedIn());
}

export default {
  login,
  logout,
  checkLogin,
};
