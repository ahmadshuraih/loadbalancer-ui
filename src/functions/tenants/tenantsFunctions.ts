/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressBook, DynamicTenant, TenantAddress } from "@/types";
import tenantsWebFacade from "../webServicesFacades/tenantsWebFacade";
import VueSimpleAlert from "vue-simple-alert";

let syncedTenantAddresses: TenantAddress[] = [];

/**
 * Returns `Promise<TenantAddress[]>`.
 *
 * Convert the fetched addressbook to a list of tenantaddress.
 */
async function convertAddressBookToTenantAddressList(addressBook: AddressBook): Promise<TenantAddress[]> {
  const tenantAddresses: TenantAddress[] = [];

  for (const tenantAddress in addressBook) {
    tenantAddresses.push(addressBook[tenantAddress]);
  }

  return tenantAddresses;
}

/**
 * Returns `Promise<void>`.
 *
 * Fetch the addressbook.
 */
async function fetchAddressBook(): Promise<void> {
  const responseAddressBook = await tenantsWebFacade.getAddressBook();

  if (responseAddressBook.error === undefined) {
    syncedTenantAddresses = await convertAddressBookToTenantAddressList(responseAddressBook);
  } else if (responseAddressBook.error !== undefined) {
    syncedTenantAddresses = [];
    VueSimpleAlert.alert(responseAddressBook.error.error);
  }
}

/**
 * Returns `Promise<TenantAddress[]>`.
 *
 * Get a sorted adresses list.
 */
async function sortTenantAddresses(): Promise<TenantAddress[]> {
  return syncedTenantAddresses.sort((a: TenantAddress, b: TenantAddress) => {
    return a.tenantId > b.tenantId ? 1 : -1;
  });
}

/**
 * Returns `Promise<TenantAddress>`.
 *
 * Get a tenant address by tenantId.
 */
async function getTenantAddressByTenantId(tenantId: string): Promise<TenantAddress> {
  if (tenantId === "new") {
    return { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0 };
  }

  const tenant = await tenantsWebFacade.getTenantAddressByTenantId(tenantId);

  if (tenant.error) {
    VueSimpleAlert.alert(tenant.error);
  }

  return tenant;
}

/**
 * Returns `Promise<void>`.
 *
 * Add static or update a tenantaddress.
 */
async function addOrUpdateTenantAddress(tenantAddress: TenantAddress): Promise<void> {
  const response = await tenantsWebFacade.addOrUpdateTenantAddress(correctNumberTypes(tenantAddress));
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `Promise<void>`.
 *
 * Add a tenantaddress dynamically.
 */
async function addTenantAddressDynamic(dynamicTenant: DynamicTenant): Promise<void> {
  const response = await tenantsWebFacade.addTenantAddressDynamic(correctNumberTypesDynamic(dynamicTenant));
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `Promise<void>`.
 *
 * Delete a tenantaddress by tenantId.
 */
async function deleteTenantAddressByTenantId(tenantId: string): Promise<void> {
  const response = await tenantsWebFacade.deleteTenantAddressByTenantId(tenantId);
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `TenantAddress`.
 *
 * This function turns the string values into number.
 */
function correctNumberTypes(tenantAddress: TenantAddress): TenantAddress {
  tenantAddress.serverPort = Number(tenantAddress.serverPort);
  tenantAddress.ramReserved = Number(tenantAddress.ramReserved);
  return tenantAddress;
}

/**
 * Returns `DynamicTenant`.
 *
 * This function turns the string values into number.
 */
function correctNumberTypesDynamic(dynamicTenant: DynamicTenant): DynamicTenant {
  dynamicTenant.ramReserved = Number(dynamicTenant.ramReserved);
  return dynamicTenant;
}

/**
 * Returns `boolean`.
 *
 * This function checks wheither the new tenant id available or not.
 */
function isAvailable(tenantId: string, editedIndex: number): boolean {
  if (editedIndex == -1) {
    for (const tenant of syncedTenantAddresses) {
      if (tenantId === tenant.tenantId) {
        return false;
      }
    }
  }

  return true;
}

export default {
  sortTenantAddresses,
  fetchAddressBook,
  getTenantAddressByTenantId,
  addOrUpdateTenantAddress,
  addTenantAddressDynamic,
  deleteTenantAddressByTenantId,
  isAvailable
};