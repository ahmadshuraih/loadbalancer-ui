<template>
  <div class="table-div">
    <h2 v-if="finalTenantAddresses && finalTenantAddresses.length == 1 && finalTenantAddresses[0].tenantId === ''">Loading data...</h2>
    <table v-else-if="finalTenantAddresses && finalTenantAddresses.length">
      <tr>
        <th>Edit</th>
        <th @click="reSortAndFilter(tenantId, 'tenantId', true)"><span id="tenantId-span">▲</span> Tenant id</th>
        <th @click="reSortAndFilter(tenantId, 'serverProtocol', true)"><span id="serverProtocol-span"></span> Server protocol</th>
        <th @click="reSortAndFilter(tenantId, 'serverName', true)"><span id="serverName-span"></span> Server name</th>
        <th @click="reSortAndFilter(tenantId, 'serverPort', true)"><span id="serverPort-span"></span> Server port</th>
        <th @click="reSortAndFilter(tenantId, 'ramReserved', true)"><span id="ramReserved-span"></span> RAM reserved</th>
      </tr>
      <tr v-for="tenantAddress in finalTenantAddresses" :key="tenantAddress.tenantId">
        <td>
          <router-link :to="{ name: 'tenantdetails', params: { tenantId: tenantAddress.tenantId, tenantType: 'Static' } }">
            <span class="far fa-edit table-edit-button"></span>
          </router-link>
        </td>
        <td>{{ tenantAddress.tenantId }}</td>
        <td>{{ tenantAddress.serverProtocol }}</td>
        <td>{{ tenantAddress.serverName }}</td>
        <td>{{ tenantAddress.serverPort }}</td>
        <td>{{ tenantAddress.ramReserved }}</td>
      </tr>
    </table>
    <h2 v-else>No data found</h2>
    <br />
  </div>
</template>

<script lang="ts">
import tenantsFunctions from "@/functions/tenants/tenantsFunctions";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tenantId: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      finalTenantAddresses: [{ tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0 }],
      sortField: "tenantId",
      sortType: "Desc",
      startUp: true,
    };
  },
  methods: {
    fetchAddresBook: async function (): Promise<void> {
      await tenantsFunctions.fetchAddressBook();
    },
    reSortAndFilter: function (tenantid: string, sortfield: string, sort: boolean): void {
      if (sortfield === "") sortfield = this.sortField;
      if (sort) this.sortType = this.sortType === "Asc" ? "Desc" : "Asc";
      tenantsFunctions.sortAndFilterTenantAddresses(tenantid, sortfield, this.sortType).then((addresses): void => {
        this.finalTenantAddresses = addresses;
        this.sortField = sortfield;
        if (!this.startUp) tenantsFunctions.setSpanSortType(sortfield, this.sortType);
        this.startUp = false;
      });
    },
  },
  created() {
    this.fetchAddresBook().then((): void => {
      this.reSortAndFilter(this.tenantId, this.sortField, true);
    });
  },
});
</script>
