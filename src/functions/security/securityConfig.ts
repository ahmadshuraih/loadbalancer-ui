import CryptoJS from "crypto-js";

/**
 * Returns `string`.
 *
 * Get the username.
 */
function getUsername(): string {
  const username = sessionStorage.getItem("jbU2jy@vj76hg&9hjhbjHGm");
  return CryptoJS.AES.decrypt(username || "", process.env.VUE_APP_KEY).toString(CryptoJS.enc.Utf8);
}

/**
 * Returns `string`.
 *
 * Get the password.
 */
function getPassword(): string {
  const password = sessionStorage.getItem("tyUas@vj76y/&9hjh^sdyJ");
  return CryptoJS.AES.decrypt(password || "", process.env.VUE_APP_KEY).toString(CryptoJS.enc.Utf8);
}

/**
 * Returns `string`.
 *
 * Get the authentication token.
 */
function getAuthenticationToken(): string {
  const authenticationToken = sessionStorage.getItem("fdUasd7jsdy/&9sddsaj_asdsd");
  return CryptoJS.AES.decrypt(authenticationToken || "", process.env.VUE_APP_KEY).toString(CryptoJS.enc.Utf8);
}

/**
 * Returns `string`.
 *
 * Get the authorization token.
 */
function getAuthorizationToken(): string {
  const authorizationToken = sessionStorage.getItem("ry*as@vsdas6y/&9asd/32h^sdGJ");
  return CryptoJS.AES.decrypt(authorizationToken || "", process.env.VUE_APP_KEY).toString(CryptoJS.enc.Utf8);
}

/**
 * Returns `string`.
 *
 * Get the web services path.
 */
function getWebServicesPath(): string {
  return process.env.VUE_APP_WEB_SERVICES_PATH;
}

/**
 * Returns `boolean`.
 *
 * This function returns if the user is logged in or not.
 */
function isLoggedIn(): boolean {
  const loggedIn = sessionStorage.getItem("rsdh*sas@vsmhjgd6y/#@aasdd2h^sd43");
  return Boolean(CryptoJS.AES.decrypt(loggedIn || "", process.env.VUE_APP_KEY).toString(CryptoJS.enc.Utf8));
}

/**
 * Returns `void`.
 *
 * Set the username.
 */
function setUsername(username: string): void {
  const encodedUsername = CryptoJS.AES.encrypt(username, process.env.VUE_APP_KEY).toString();
  sessionStorage.setItem("jbU2jy@vj76hg&9hjhbjHGm", encodedUsername);
}

/**
 * Returns `void`.
 *
 * Set the password.
 */
function setPassword(password: string): void {
  const encodedPassword = CryptoJS.AES.encrypt(password, process.env.VUE_APP_KEY).toString();
  sessionStorage.setItem("tyUas@vj76y/&9hjh^sdyJ", encodedPassword);
}

/**
 * Returns `void`.
 *
 * Set the authentication token.
 */
function setAuthenticationToken(token: string): void {
  const encodedAuthenticationToken = CryptoJS.AES.encrypt(token, process.env.VUE_APP_KEY).toString();
  sessionStorage.setItem("fdUasd7jsdy/&9sddsaj_asdsd", encodedAuthenticationToken);
}

/**
 * Returns `void`.
 *
 * Set the authorization token.
 */
function setAuthorizationToken(token: string): void {
  const encodedAuthorizationToken = CryptoJS.AES.encrypt(token, process.env.VUE_APP_KEY).toString();
  sessionStorage.setItem("ry*as@vsdas6y/&9asd/32h^sdGJ", encodedAuthorizationToken);
}

/**
 * Returns `void`.
 *
 * This function sets the login status of the user.
 */
function setLoggedIn(loggedIn: boolean): void {
  const encodedLoggedIn = CryptoJS.AES.encrypt(`${loggedIn}`, process.env.VUE_APP_KEY).toString();
  sessionStorage.setItem("rsdh*sas@vsmhjgd6y/#@aasdd2h^sd43", encodedLoggedIn);
}

/**
 * Returns `void`.
 *
 * Clear all data from session storage.
 */
function clearSession(): void {
  sessionStorage.clear();
}

export default {
  getUsername,
  getPassword,
  getAuthenticationToken,
  getAuthorizationToken,
  getWebServicesPath,
  isLoggedIn,
  setUsername,
  setPassword,
  setAuthenticationToken,
  setAuthorizationToken,
  setLoggedIn,
  clearSession,
};
