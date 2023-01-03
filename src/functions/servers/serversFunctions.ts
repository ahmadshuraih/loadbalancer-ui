/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexedServer, Server, Servers } from "@/types";
import router from "@/router";
import serversWebFacade from "../webServicesFacades/serversWebFacade";
import VueSimpleAlert from "vue-simple-alert";

let syncedIndexedServers: IndexedServer[] = [];

/**
 * Returns `Promise<IndexedServer[]>`.
 *
 * Convert the fetched servers to a list of indexedServers.
 */
async function convertServersToIndexedServersList(servers: Servers): Promise<IndexedServer[]> {
  const indexedServers: IndexedServer[] = [];

  for (const serverIndex in servers) {
    const server = servers[serverIndex];
    const serverToAdd: IndexedServer = {
      protocol: server.protocol,
      name: server.name,
      port: server.port,
      ramCapacity: server.ramCapacity,
      availableRAM: server.availableRAM,
      totalAssignedTenants: server.totalAssignedTenants,
      index: serverIndex,
    };

    indexedServers.push(serverToAdd);
  }

  return indexedServers;
}

/**
 * Returns `Promise<void>`.
 *
 * Fetch the servers.
 */
async function fetchServers(): Promise<void> {
  const responseServers = await serversWebFacade.getServers();

  if (responseServers.error === undefined) {
    syncedIndexedServers = await convertServersToIndexedServersList(responseServers);
  } else if (responseServers.error !== undefined) {
    syncedIndexedServers = [];
    VueSimpleAlert.alert(responseServers.error.error);
  }
}

/**
 * Returns `Promise<IndexedServer[]>`.
 *
 * Get a sorted and filtered indexedservers list.
 */
async function sortAndFilterServers(index: string, sortField: string, sortType: string): Promise<IndexedServer[]> {
  const filtered =
    index !== ""
      ? syncedIndexedServers.filter((indexedServer: IndexedServer) => {
          return indexedServer.index.startsWith(index);
        })
      : syncedIndexedServers;

  if (sortType === "Asc") {
    return filtered.sort((a: IndexedServer, b: IndexedServer) => {
      return a[sortField as keyof IndexedServer] > b[sortField as keyof IndexedServer] ? 1 : -1;
    });
  } else {
    return filtered.sort((a: IndexedServer, b: IndexedServer) => {
      return a[sortField as keyof IndexedServer] < b[sortField as keyof IndexedServer] ? 1 : -1;
    });
  }
}

/**
 * Returns `string[]`.
 *
 * Get all servers names.
 */
function getServersNames(): string[] {
  const serversNames: string[] = [];

  for (const server of syncedIndexedServers) {
    if (!serversNames.includes(server.name)) serversNames.push(server.name);
  }

  return serversNames;
}

/**
 * Returns `{ ports: number[], protocol: string }`.
 *
 * Get all ports of a specific server with the protocol of it.
 */
function getServerPortsAndProtocol(serverName: string): { ports: number[], protocol: string } {
  const serverPorts: number[] = [];
  let serverProtocol = '';

  for (const server of syncedIndexedServers) {
    if (server.name === serverName) {
      serverPorts.push(server.port);
      serverProtocol = server.protocol;
    } 
  }

  return { ports: serverPorts, protocol: serverProtocol };
}

/**
 * Returns `Promise<Server>`.
 *
 * Get a server by index.
 */
async function getServerByIndex(index: string): Promise<Server> {
  if (index === "new") {
    return { protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0 };
  }

  const server = await serversWebFacade.getServerByIndex(index);

  if (server.error) {
    router.push({ name: "servers" });
    VueSimpleAlert.alert(server.error);
  }

  return server;
}

/**
 * Returns `Promise<void>`.
 *
 * Add or update server.
 */
async function addOrUpdateServer(event: Event, server: Server): Promise<void> {
  event.preventDefault();
  const response = await serversWebFacade.addOrUpdateServer(correctNumberTypes(server));
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
    router.push({ name: "servers" });
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `Promise<void>`.
 *
 * Delete a server by index.
 * If withChildren is true, the assigned tenantaddresses will be deleted.
 */
async function deleteServerByIndex(event: Event, index: string, withChildren: boolean): Promise<void> {
  event.preventDefault();
  VueSimpleAlert.confirm("Are you sure that you want to delete this server?").then(async () => {
    const response = await serversWebFacade.deleteServerByIndex(index, withChildren);
    if (response.succeed) {
      VueSimpleAlert.alert(response.message);
      router.push({ name: "servers" });
    } else {
      VueSimpleAlert.alert(response.error);
    }
  });
}

/**
 * Returns `Server`.
 *
 * This function turns the string values into number.
 */
function correctNumberTypes(server: Server): Server {
  server.port = Number(server.port);
  server.ramCapacity = Number(server.ramCapacity);
  server.availableRAM = Number(server.availableRAM);
  server.totalAssignedTenants = Number(server.totalAssignedTenants);
  if (server.totalAssignedTenants == 0) server.totalAssignedTenants = 1;
  return server;
}

/**
 * Returns `boolean`.
 *
 * Check if this object an empty server object.
 */
function serverIsNotEmpty(server: Server): boolean {
  return (
    server.protocol !== "" ||
    server.name !== "" ||
    server.port != 0 ||
    server.ramCapacity != 0 ||
    server.availableRAM != 0 ||
    server.totalAssignedTenants != 0
  );
}

/**
 * Returns `void`.
 *
 * This function redirect to an empty serverdetails page.
 */
function showAddForm(): void {
  router.push({ name: "serverdetails", params: { serverIndex: "new" } });
}

/**
 * Returns `void`.
 *
 * This function show popup when press on delete button.
 */
function showPopup(event: Event): void {
  event.preventDefault();
  const popUpsUl = document.querySelector("#server-popup") as HTMLElement;
  const deleteBtn = document.querySelector("#delete-server-btn") as HTMLElement;
  popUpsUl.style.top = `${deleteBtn.offsetTop - 134}px`;
  popUpsUl.style.left = `${deleteBtn.offsetLeft - deleteBtn.offsetWidth / 2 - 7}px`;
  popUpsUl.classList.toggle("show");
}

/**
 * Returns `void`.
 *
 * This function sets the appropriate sort type symbol to the appropriate table header
 */
function setSpanSortType(sortField: string, sortType: string): void {
  (document.querySelector(`#index-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#protocol-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#name-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#port-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#ramCapacity-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#availableRAM-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#totalAssignedTenants-span`) as HTMLElement).innerHTML = "";
  (document.querySelector(`#${sortField}-span`) as HTMLElement).innerHTML = sortType === "Asc" ? "▲" : "▼";
}

export default {
  fetchServers,
  sortAndFilterServers,
  getServersNames,
  getServerPortsAndProtocol,
  getServerByIndex,
  addOrUpdateServer,
  deleteServerByIndex,
  serverIsNotEmpty,
  showPopup,
  showAddForm,
  setSpanSortType,
};
