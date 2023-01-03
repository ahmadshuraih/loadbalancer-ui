/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressBook, DynamicTenant, TenantAddress } from "@/types";
import router from "@/router";
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
 * Get a sorted and filtered adresses list.
 */
async function sortAndFilterTenantAddresses(tenantId: string, sortField: string, sortType: string): Promise<TenantAddress[]> {
  const filtered =
    tenantId !== ""
      ? syncedTenantAddresses.filter((tenantAddress: TenantAddress) => {
          return tenantAddress.tenantId.startsWith(tenantId);
        })
      : syncedTenantAddresses;

  if (sortType === "Asc") {
    return filtered.sort((a: TenantAddress, b: TenantAddress) => {
      return a[sortField as keyof TenantAddress] > b[sortField as keyof TenantAddress] ? 1 : -1;
    });
  } else {
    return filtered.sort((a: TenantAddress, b: TenantAddress) => {
      return a[sortField as keyof TenantAddress] < b[sortField as keyof TenantAddress] ? 1 : -1;
    });
  }
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
    router.push({ name: "tenants" });
    VueSimpleAlert.alert(tenant.error);
  }

  return tenant;
}

/**
 * Returns `Promise<void>`.
 *
 * Add static or update a tenantaddress.
 */
async function addOrUpdateTenantAddress(event: Event, tenantAddress: TenantAddress): Promise<void> {
  event.preventDefault();
  const response = await tenantsWebFacade.addOrUpdateTenantAddress(correctNumberTypes(tenantAddress));
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
    router.push({ name: "tenants" });
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `Promise<void>`.
 *
 * Add a tenantaddress dynamically.
 */
async function addTenantAddressDynamic(event: Event, dynamicTenant: DynamicTenant): Promise<void> {
  event.preventDefault();
  const response = await tenantsWebFacade.addTenantAddressDynamic(correctNumberTypesDynamic(dynamicTenant));
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
    router.push({ name: "tenants" });
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `Promise<void>`.
 *
 * Delete a tenantaddress by tenantId.
 */
async function deleteTenantAddressByTenantId(event: Event, tenantId: string): Promise<void> {
  event.preventDefault();
  VueSimpleAlert.confirm("Are you sure that you want to delete this tenant address?").then(async () => {
    const response = await tenantsWebFacade.deleteTenantAddressByTenantId(tenantId);
    if (response.succeed) {
      VueSimpleAlert.alert(response.message);
      router.push({ name: "tenants" });
    } else {
      VueSimpleAlert.alert(response.error);
    }
  });
}

/**
 * Returns `boolean`.
 *
 * Check if this object an empty TenantAddress object.
 */
function tenantAddressIsNotEmpty(tenantAddress: TenantAddress): boolean {
  return (
    tenantAddress.tenantId !== "" ||
    tenantAddress.serverProtocol !== "" ||
    tenantAddress.serverName != "" ||
    tenantAddress.serverPort != 0 ||
    tenantAddress.ramReserved != 0
  );
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
 * Returns `void`.
 *
 * This function redirect to an empty tenantdetails page.
 */
function showAddForm(tenantType: string): void {
  router.push({ name: "tenantdetails", params: { tenantId: "new", tenantType } });
}

/**
 * Returns `void`.
 *
 * This function shows the popup menu of add new tenant button.
 */
function showPopup(): void {
  const popUpsUl = document.querySelector("#tenant-popup") as HTMLElement;
  popUpsUl.classList.toggle("show");
}

/**
 * Returns `void`.
 *
 * This function hides the popup menus.
 */
function hidePopupWhenClickOutside(): void {
  document.onclick = function (event: any) {
    const popUpsTenantUl = document.querySelector("#tenant-popup") as HTMLElement;
    const popUpsServerUl = document.querySelector("#server-popup") as HTMLElement;
    if (event.target.id !== "server-popup" && event.target.id !== "delete-server-btn" && popUpsServerUl) {
      popUpsServerUl.classList.remove("show");
    }
    if (event.target.id !== "tenant-popup" && event.target.id !== "add-button" && popUpsTenantUl) {
      popUpsTenantUl.classList.remove("show");
    }
  };
}

/**
 * Returns `void`.
 *
 * This function sets the appropriate sort type symbol to the appropriate table header
 */
function setSpanSortType(sortField: string, sortType: string): void {
  (document.querySelector(`#tenantId-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#serverProtocol-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#serverName-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#serverPort-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#ramReserved-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#${sortField}-span`) as HTMLElement).innerHTML = sortType === "Asc" ? "▲" : "▼";
}

export default {
  sortAndFilterTenantAddresses,
  fetchAddressBook,
  getTenantAddressByTenantId,
  addOrUpdateTenantAddress,
  addTenantAddressDynamic,
  deleteTenantAddressByTenantId,
  tenantAddressIsNotEmpty,
  showAddForm,
  showPopup,
  hidePopupWhenClickOutside,
  setSpanSortType,
};
