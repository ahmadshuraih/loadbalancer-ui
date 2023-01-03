<template>
  <div class="details-form-div">
    <form class="details-form">
      <h2><span class="fa fa-server"></span> Server details</h2>
      <label class="details-label">Protocol:</label>
      <input class="details-input" type="text" v-model="server.protocol" required />
      <label class="details-label">Name:</label>
      <input class="details-input" type="text" v-model="server.name" required :disabled="notEmptyServer" />
      <label class="details-label">Port:</label>
      <input class="details-input" type="text" v-model="server.port" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required :disabled="notEmptyServer" />
      <label class="details-label">RAM capacity:</label>
      <input class="details-input" type="text" v-model="server.ramCapacity" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required />
      <label class="details-label">Available RAM:</label>
      <input class="details-input" type="text" v-model="server.availableRAM" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required />
      <label class="details-label">Total tenants:</label>
      <input class="details-input" type="text" v-model="server.totalAssignedTenants" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required />
      <div class="details-button-div">
        <button class="add-update-button" v-if="!notEmptyServer" @click="addOrUpdateServer"><span class="fa fa-plus"></span> Add</button>
        <button class="add-update-button" v-if="notEmptyServer" @click="addOrUpdateServer"><span class="fa fa-edit"></span> Update</button>
        <button v-if="notEmptyServer" class="delete-button" @click="togglePopup" id="delete-server-btn"><span class="fa fa-trash"></span> Delete</button>
        <ul id="server-popup" class="popup-ul-server">
          <li class="popup" id="withChildrePopup" @click="deleteServer($event, true)">With child tenants</li>
          <li class="popup" id="withoutChildrenPopup" @click="deleteServer($event, false)">Without child tenants</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import serversFunctions from "@/functions/servers/serversFunctions";
import { ServerResponse } from "@/types";
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
      server: { protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0 },
      notEmptyServer: false,
    };
  },
  methods: {
    addOrUpdateServer: function (event: Event): void {
      serversFunctions.addOrUpdateServer(event, this.server);
    },
    deleteServer: function (event: Event, withChildren: boolean): void {
      serversFunctions.deleteServerByIndex(event, this.serverIndex, withChildren);
    },
    togglePopup: function (event: Event): void {
      serversFunctions.showPopup(event);
    },
  },
  created() {
    serversFunctions.getServerByIndex(this.serverIndex).then((responseServer: ServerResponse): void => {
      this.notEmptyServer = serversFunctions.serverIsNotEmpty(responseServer);
      this.server = responseServer;

      if (this.serverIndex && this.serverIndex !== "new" && responseServer.error !== undefined) {
        this.$alert(responseServer.error);
      }
    });
  },
});
</script>
