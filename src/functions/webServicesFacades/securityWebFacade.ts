/* eslint-disable @typescript-eslint/no-explicit-any */
import { LBResponse, LoginResponse, SecurityInfo } from "@/types";
import axios from "axios";
import loginFunctions from "../security/loginFunctions";
import securityConfig from "../security/securityConfig";

/**
 * Returns `Promise<LoginResponse>`.
 *
 * This logs the user in.
 */
async function login(username: string, password: string): Promise<LoginResponse> {
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (await axios.post(`${basePath}/login`, { username, password })).data;
  } catch (err: any) {
    if (err.message === "Network Error") {
      loginFunctions.logout();
      return { succeed: false, error: "The load balancer server is not responding" };
    }

    return err.response.data;
  }
}

/**
 * Returns `Promise<LBResponse>`.
 *
 * This function updates the security info in the load balancer.
 */
async function updateSecurityInfo(securityInfo: SecurityInfo): Promise<LBResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const authorization = securityConfig.getAuthorizationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (
      await axios.post(`${basePath}/securityinfo`, securityInfo, {
        headers: { authenticationtoken: authentication, authorizationtoken: authorization },
      })
    ).data;
  } catch (err: any) {
    if (err.message === "Network Error") {
      loginFunctions.logout();
      return { succeed: false, error: "The load balancer server is not responding" };
    }

    return err.response.data;
  }
}

export default {
  login,
  updateSecurityInfo,
};
