<template>
  <div class="details-form-div">
    <form class="details-form">
      <h2><span class="fa fa-address-card"></span> Tenant details</h2>
      <label class="details-label">Tenant Id:</label>
      <input class="details-input" type="text" v-model="tenantAddress.tenantId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required :disabled="notEmptyTenantAddress" />
      <label class="details-label">Server protocol:</label>
      <input class="details-input" type="text" v-model="tenantAddress.serverProtocol" required disabled />
      <label class="details-label">Server name:</label>
      <select v-model="tenantAddress.serverName" class="details-select" @change="getServerportsAndProtocol" required>
        <option v-for="server in servers" :key="server">{{ server }}</option>
      </select>
      <label class="details-label">Server port:</label>
      <select v-model="tenantAddress.serverPort" class="details-select" required>
        <option v-for="port in ports" :key="port">{{ port }}</option>
      </select>
      <label class="details-label">RAM reserved:</label>
      <input class="details-input" type="text" v-model="tenantAddress.ramReserved" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required />
      <div class="details-button-div">
        <button class="add-update-button" v-if="!notEmptyTenantAddress" @click="addOrUpdateTenantAddress"><span class="fa fa-plus"></span> Add</button>
        <button class="add-update-button" v-if="notEmptyTenantAddress" @click="addOrUpdateTenantAddress"><span class="fa fa-edit"></span> Update</button>
        <button v-if="notEmptyTenantAddress" class="delete-button" @click="deleteTenantAddress"><span class="fa fa-trash"></span> Delete</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import serversFunctions from "@/functions/servers/serversFunctions";
import tenantFunctions from "@/functions/tenants/tenantsFunctions";
import { TenantAddressResponse } from "@/types";
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
      servers: [""],
      ports: [0],
      tenantAddress: { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0 },
      notEmptyTenantAddress: false,
    };
  },
  methods: {
    addOrUpdateTenantAddress: function (event: Event): void {
      tenantFunctions.addOrUpdateTenantAddress(event, this.tenantAddress);
    },
    deleteTenantAddress: function (event: Event): void {
      tenantFunctions.deleteTenantAddressByTenantId(event, this.tenantId);
    },
    getServerportsAndProtocol: function (): void {
      const portsAndProtocol = serversFunctions.getServerPortsAndProtocol(this.tenantAddress.serverName);
      this.ports = portsAndProtocol.ports;
      this.tenantAddress.serverProtocol = portsAndProtocol.protocol;
    },
  },
  created() {
    tenantFunctions.getTenantAddressByTenantId(this.tenantId).then((address: TenantAddressResponse): void => {
      this.notEmptyTenantAddress = tenantFunctions.tenantAddressIsNotEmpty(address);
      this.tenantAddress = address;

      if (this.tenantId && this.tenantId !== "new" && address.error !== undefined) {
        this.$alert(address.error);
      } else {
        serversFunctions.fetchServers().then((): void => {
          this.servers = serversFunctions.getServersNames();
          const portsAndProtocol = serversFunctions.getServerPortsAndProtocol(this.tenantAddress.serverName);
          this.ports = portsAndProtocol.ports;
          this.tenantAddress.serverProtocol = portsAndProtocol.protocol;
        });
      }
    });
  },
});
</script>
