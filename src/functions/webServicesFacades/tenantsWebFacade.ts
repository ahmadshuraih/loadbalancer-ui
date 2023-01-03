/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressBookResponse, DynamicTenant, LBResponse, TenantAddress, TenantAddressResponse } from "../../types";
import axios from "axios";
import securityConfig from "../security/securityConfig";
import loginFunctions from "../security/loginFunctions";

/**
 * Returns `Promise<AddressBookResponse>`.
 *
 * This function fetches the addressbook from the load balancer.
 */
async function getAddressBook(): Promise<AddressBookResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (await axios.get(`${basePath}/addressbook`, { headers: { authenticationtoken: authentication } })).data;
  } catch (err: any) {
    if (err.message === "Network Error") {
      loginFunctions.logout();
      return {
        error: {
          tenantId: "",
          serverProtocol: "",
          serverName: "",
          serverPort: 0,
          ramReserved: 0,
          error: "The load balancer server is not responding",
        },
      };
    }

    return { error: { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0, error: err.response.data.error } };
  }
}

/**
 * Returns `Promise<TenantAddressResponse>`.
 *
 * This function fetches one tenantaddress by tenantid from the load balancer.
 */
async function getTenantAddressByTenantId(tenantId: string): Promise<TenantAddressResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (await axios.get(`${basePath}/tenant/get/${tenantId}`, { headers: { authenticationtoken: authentication } })).data;
  } catch (err: any) {
    if (err.message === "Network Error") {
      loginFunctions.logout();
      return { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0, error: "The load balancer server is not responding" };
    }

    return { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0, error: err.response.data.error };
  }
}

/**
 * Returns `Promise<LBResponse>`.
 *
 * This function adds statically or updates one tenantaddress in the load balancer.
 */
async function addOrUpdateTenantAddress(tenantAddress: TenantAddress): Promise<LBResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const authorization = securityConfig.getAuthorizationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (
      await axios.post(`${basePath}/tenant/add/static`, tenantAddress, {
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
 * This function adds dynamically one tenantaddress in the load balancer.
 */
async function addTenantAddressDynamic(dynamicTenant: DynamicTenant): Promise<LBResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const authorization = securityConfig.getAuthorizationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (
      await axios.post(`${basePath}/tenant/add/dynamic`, dynamicTenant, {
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
 * This function deletes one tenantaddress by tenantid from the load balancer.
 */
async function deleteTenantAddressByTenantId(tenantId: string): Promise<LBResponse> {
  const authentication = securityConfig.getAuthenticationToken();
  const authorization = securityConfig.getAuthorizationToken();
  const basePath = securityConfig.getWebServicesPath();
  try {
    return (
      await axios.delete(`${basePath}/tenant/delete/${tenantId}`, {
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
  getAddressBook,
  getTenantAddressByTenantId,
  addOrUpdateTenantAddress,
  addTenantAddressDynamic,
  deleteTenantAddressByTenantId,
};
