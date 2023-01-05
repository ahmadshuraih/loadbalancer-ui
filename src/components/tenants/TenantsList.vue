<template>
  <div class="table-div">
    <v-data-table
      item-key="name"
      class="elevation-1"
      v-if="finalTenantAddresses && finalTenantAddresses.length == 1 && finalTenantAddresses[0].tenantId === ''"
      loading
      loading-text="Loading... Please wait"
    ></v-data-table>
    <v-data-table
      v-else-if="finalTenantAddresses && finalTenantAddresses.length"
      fixed-header
      :height="tableHeight"
      :headers="headers"
      :items="finalTenantAddresses"
      :search="search"
      sort-by="index"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title><span class="fa fa-address-card"></span> Tenants</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-2" fab small color="success" v-bind="attrs" v-on="on"><v-icon dark>mdi-plus</v-icon></v-btn>
            </template>
            <v-list color="success">
              <v-list-item @click="addTenantStatic">
                <v-list-item-title class="white-list-item-title">Add statically</v-list-item-title>
              </v-list-item>
              <v-list-item @click="addTenantDynamic">
                <v-list-item-title class="white-list-item-title">Add dynamically</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle() }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedTenant.tenantId"
                          :rules="tenantIdRules"
                          hide-spin-buttons
                          label="Tenant id"
                          :disabled="editedIndex != -1"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedTenant.serverProtocol"
                          :rules="serverProtocolRules"
                          label="Server protocol"
                          disabled
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedTenant.serverName"
                          :items="serversNames"
                          :rules="serverNameRules"
                          :disabled="addType === 'dynamic'"
                          label="Server name"
                          @change="getServerPorts"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          v-model="editedTenant.serverPort"
                          :items="serverPorts"
                          :disabled="addType === 'dynamic'"
                          :rules="serverPortRules"
                          label="Server port"
                          required
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedTenant.ramReserved"
                          :rules="ramReservedRules"
                          hide-spin-buttons
                          label="RAM reserved"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="close"> Cancel </v-btn>
                <v-btn color="success" @click="save"> Save </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h6 justify-center">Are you sure you want to delete this tenant address?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="closeDelete">Cancel</v-btn>
                <v-btn color="error" @click="deleteTenantAddressConfirm">Delete</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="primary" small class="mr-2" @click="editTenantAddress(item)"> mdi-pencil </v-icon>
        <v-icon color="error" small class="mr-2" @click="deleteTenantAddress(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="resort"> Reset </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import serversFunctions from "@/functions/servers/serversFunctions";
import tenantsFunctions from "@/functions/tenants/tenantsFunctions";
import { TenantAddress } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    tenantId: {
      required: false,
      type: String,
    }
  },
  data() {
    return {
      finalTenantAddresses: [{ tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0 }],
      serversNames: [""],
      serverPorts: [0],
      search: "",
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedTenant: { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0 },
      defaultTenant: { tenantId: "", serverProtocol: "", serverName: "", serverPort: 0, ramReserved: 0 },
      headers: [
        { text: "Tenant Id", value: "tenantId" },
        { text: "Server protocol", value: "serverProtocol" },
        { text: "Server Name", value: "serverName" },
        { text: "Server port", value: "serverPort" },
        { text: "RAM reserved", value: "ramReserved" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      tenantIdRules: [(v: string) => !!v || "Tenant id is required"],
      serverProtocolRules: [(v: string) => !!v || "Server protocol is required"],
      serverNameRules: [(v: string) => !!v || "Server name is required"],
      serverPortRules: [(v: string) => !!v || "Server port is required"],
      ramReservedRules: [(v: string) => !!v || "RAM reserved is required"],
      addType: "static",
      tableHeight: `${window.innerHeight - 260}px`,
    };
  },
  watch: {
    dialog(val: any): void {
      val || this.close();
    },
    dialogDelete(val: any): void {
      val || this.closeDelete();
    },
  },
  methods: {
    async fetchAddressBook(): Promise<void> {
      tenantsFunctions.fetchAddressBook().then(async (): Promise<void> => {
        tenantsFunctions.sortTenantAddresses().then((tenantAddress) => {
          this.finalTenantAddresses = tenantAddress;
          this.fetchServers();
        });
      });
    },
    async fetchServers(): Promise<void> {
      serversFunctions.fetchServers().then(async (): Promise<void> => {
        serversFunctions.sortServers().then(() => {
          this.getServersNames();
        });
      });
    },
    resort(): void {
      tenantsFunctions.sortTenantAddresses().then((tenantAddress) => {
        this.finalTenantAddresses = tenantAddress;
      });
    },
    getServersNames(): void {
      this.serversNames = serversFunctions.getServersNames();
    },
    getServerPorts(): void {
      const portsAndProtocol = serversFunctions.getServerPortsAndProtocol(this.editedTenant.serverName);
      this.serverPorts = portsAndProtocol.ports;
      this.editedTenant.serverProtocol = portsAndProtocol.protocol;
    },
    formTitle(): string {
      return this.editedIndex == -1 ? "New tenant address" : "Edit tenant address";
    },
    editTenantAddress(tenantAddress: TenantAddress): void {
      this.editedIndex = this.finalTenantAddresses.indexOf(tenantAddress);
      this.editedTenant = Object.assign({}, tenantAddress);
      this.getServersNames();
      this.getServerPorts();
      this.dialog = true;
    },
    addTenantStatic(): void {
      this.addType = "static";
      this.editTenantAddress(this.defaultTenant);
    },
    addTenantDynamic(): void {
      this.addType = "dynamic";
      this.editTenantAddress(this.defaultTenant);
    },
    deleteTenantAddress(tenantAddress: TenantAddress): void {
      this.editedIndex = this.finalTenantAddresses.indexOf(tenantAddress);
      this.editedTenant = Object.assign({}, tenantAddress);
      this.dialogDelete = true;
    },
    deleteTenantAddressConfirm(): void {
      tenantsFunctions.deleteTenantAddressByTenantId(this.editedTenant.tenantId).then(() => {
        this.fetchAddressBook();
        this.closeDelete();
      });
    },
    close(): void {
      this.dialog = false;
      this.addType = "static";
      this.$nextTick(() => {
        this.editedTenant = Object.assign({}, this.defaultTenant);
        this.editedIndex = -1;
      });
    },
    closeDelete(): void {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedTenant = Object.assign({}, this.defaultTenant);
        this.editedIndex = -1;
      });
    },
    save(): void {
      let form: any = this.$refs.form;
      if (tenantsFunctions.isAvailable(this.editedTenant.tenantId, this.editedIndex)) {
        if (this.addType === "static") {
          if (form.validate()) {
            tenantsFunctions.addOrUpdateTenantAddress(this.editedTenant).then(() => {
              this.fetchAddressBook();
              this.close();
            });
          }
        } else {
          if (this.editedTenant.tenantId && this.editedTenant.ramReserved) {
            const dynamicTenant = { tenantId: this.editedTenant.tenantId, ramReserved: this.editedTenant.ramReserved };
            tenantsFunctions.addTenantAddressDynamic(dynamicTenant).then(() => {
              this.fetchAddressBook();
              this.close();
            });
          } else {
            this.$alert("Please fill the required values");
          }
        }
      } else {
        this.$alert(`Tenant id ${this.editedTenant.tenantId} already exists`);
      }
    },
  },
  created() {
    this.fetchAddressBook();
    if (this.tenantId) {
      this.search = this.tenantId;
    } else {
      this.search = ""
    }
  }
});
</script>
