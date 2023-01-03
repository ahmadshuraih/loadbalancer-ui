/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, LBResponse, ServersResponse, ServerResponse } from "../../types";
import axios from "axios";
import securityConfig from "../security/securityConfig";
import loginFunctions from "../security/loginFunctions";

/**
 * Returns `Promise<ServersResponse>`.
 *
 * This function fetches all servers from the load balancer.
 */
async function getServers(): Promise<ServersResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (await axios.get(`${basePath}/servers`, { headers: { authenticationtoken: authentication } })).data;
  } catch (err: any) {
    if (err.message === "Network Error") {
      loginFunctions.logout();
      return {
        error: {
          protocol: "",
          name: "",
          port: 0,
          ramCapacity: 0,
          availableRAM: 0,
          totalAssignedTenants: 0,
          error: "The load balancer server is not responding",
        },
      };
    }

    return { error: { protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0, error: err.response.data.error } };
  }
}

/**
 * Returns `Promise<ServerResponse>`.
 *
 * This function fetches one server by index from the load balancer.
 */
async function getServerByIndex(index: string): Promise<ServerResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (await axios.get(`${basePath}/servers/get/${index}`, { headers: { authenticationtoken: authentication } })).data;
  } catch (err: any) {
    if (err.message === "Network Error") {
      loginFunctions.logout();
      return {
        protocol: "",
        name: "",
        port: 0,
        ramCapacity: 0,
        availableRAM: 0,
        totalAssignedTenants: 0,
        error: "The load balancer server is not responding",
      };
    }

    return { protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0, error: err.response.data.error };
  }
}

/**
 * Returns `Promise<LBResponse>`.
 *
 * This function adds/updates one server in the load balancer.
 */
async function addOrUpdateServer(server: Server): Promise<LBResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const authorization = securityConfig.getAuthorizationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (
      await axios.post(`${basePath}/servers/add`, server, {
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

/**
 * Returns `Promise<LBResponse>`.
 *
 * This function deletes one server by index from the load balancer.
 * If withChildren is true, the assigned tenantaddresses will be deleted.
 */
async function deleteServerByIndex(index: string, withChildren: boolean): Promise<LBResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const authorization = securityConfig.getAuthorizationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (
      await axios.delete(`${basePath}/servers/delete/${index}/${withChildren}`, {
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
  getServers,
  getServerByIndex,
  addOrUpdateServer,
  deleteServerByIndex,
};
