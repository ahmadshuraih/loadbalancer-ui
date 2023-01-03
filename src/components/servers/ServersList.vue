<template>
  <div class="table-div">
    <h2 v-if="finalServers && finalServers.length == 1 && finalServers[0].index === ''">Loading data...</h2>
    <table v-else-if="finalServers && finalServers.length">
      <tr>
        <th>Edit</th>
        <th @click="reSortAndFilter(serverIndex, 'index', true)"><span id="index-span">▲</span> Index</th>
        <th @click="reSortAndFilter(serverIndex, 'protocol', true)"><span id="protocol-span"></span> Protocol</th>
        <th @click="reSortAndFilter(serverIndex, 'name', true)"><span id="name-span"></span> Name</th>
        <th @click="reSortAndFilter(serverIndex, 'port', true)"><span id="port-span"></span> Port</th>
        <th @click="reSortAndFilter(serverIndex, 'ramCapacity', true)"><span id="ramCapacity-span"></span> RAM capacity</th>
        <th @click="reSortAndFilter(serverIndex, 'availableRAM', true)"><span id="availableRAM-span"></span> Available RAM</th>
        <th @click="reSortAndFilter(serverIndex, 'totalAssignedTenants', true)"><span id="totalAssignedTenants-span"></span> Total tenants</th>
      </tr>
      <tr v-for="server in finalServers" :key="server.index">
        <td>
          <router-link :to="{ name: 'serverdetails', params: { serverIndex: server.index } }">
            <span class="far fa-edit table-edit-button"></span>
          </router-link>
        </td>
        <td>{{ server.index }}</td>
        <td>{{ server.protocol }}</td>
        <td>{{ server.name }}</td>
        <td>{{ server.port }}</td>
        <td>{{ server.ramCapacity }}</td>
        <td>{{ server.availableRAM }}</td>
        <td>{{ server.totalAssignedTenants }}</td>
      </tr>
    </table>
    <h2 v-else>No data found</h2>
    <br />
  </div>
</template>

<script lang="ts">
import serversFunctions from "@/functions/servers/serversFunctions";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    serverIndex: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      finalServers: [{ protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0, index: "" }],
      sortField: "index",
      sortType: "Desc",
      startUp: true,
    };
  },
  methods: {
    fetchServers: async function (): Promise<void> {
      await serversFunctions.fetchServers();
    },
    reSortAndFilter: function (serverindex: string, sortfield: string, sort: boolean): void {
      if (sortfield === "") sortfield = this.sortField;
      if (sort) this.sortType = this.sortType === "Asc" ? "Desc" : "Asc";
      serversFunctions.sortAndFilterServers(serverindex, sortfield, this.sortType).then((servers): void => {
        this.finalServers = servers;
        this.sortField = sortfield;
        if (!this.startUp) serversFunctions.setSpanSortType(sortfield, this.sortType);
        this.startUp = false;
      });
    },
  },
  created() {
    this.fetchServers().then((): void => {
      this.reSortAndFilter(this.serverIndex, this.sortField, true);
    });
  },
});
</script>
