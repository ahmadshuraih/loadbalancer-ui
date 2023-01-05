/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexedServer, Server, Servers } from "@/types";
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
 * Get a sorted indexedservers list.
 */
async function sortServers(): Promise<IndexedServer[]> {
  return syncedIndexedServers.sort((a: IndexedServer, b: IndexedServer) => {
    return a.index > b.index ? 1 : -1;
  });
}

/**
 * Returns `Promise<string[]>`.
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
function getServerPortsAndProtocol(serverName: string): { ports: number[]; protocol: string } {
  const serverPorts: number[] = [];
  let serverProtocol = "";

  for (const server of syncedIndexedServers) {
    if (server.name === serverName) {
      serverPorts.push(server.port);
      serverProtocol = server.protocol;
    }
  }

  return { ports: serverPorts, protocol: serverProtocol };
}

/**
 * Returns `Promise<void>`.
 *
 * Add or update server.
 */
async function addOrUpdateServer(indexedServer: IndexedServer): Promise<void> {
  const response = await serversWebFacade.addOrUpdateServer(correctNumberTypes(indexedServer));
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
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
async function deleteServerByIndex(index: string, withChildren: boolean): Promise<void> {
  const response = await serversWebFacade.deleteServerByIndex(index, withChildren);
  if (response.succeed) {
    VueSimpleAlert.alert(response.message);
  } else {
    VueSimpleAlert.alert(response.error);
  }
}

/**
 * Returns `Server`.
 *
 * This function turns the string values into number.
 */
function correctNumberTypes(indexedServer: IndexedServer): Server {
  return {
    protocol: indexedServer.protocol,
    name: indexedServer.name,
    port: indexedServer.port,
    ramCapacity: indexedServer.ramCapacity,
    availableRAM: indexedServer.availableRAM,
    totalAssignedTenants: indexedServer.totalAssignedTenants == 0 ? (indexedServer.totalAssignedTenants = 1) : indexedServer.totalAssignedTenants,
  };
}

/**
 * Returns `boolean`.
 *
 * This function checks wheither the new server index available or not.
 */
 function isAvailable(serverIndex: string, editedIndex: number): boolean {
  if (editedIndex == -1) {
    for (const server of syncedIndexedServers) {
      if (serverIndex === server.index) {
        return false;
      }
    }
  }

  return true;
}

export default {
  fetchServers,
  sortServers,
  getServersNames,
  getServerPortsAndProtocol,
  addOrUpdateServer,
  deleteServerByIndex,
  isAvailable
};
