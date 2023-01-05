<template>
  <div class="table-div">
    <v-data-table
      item-key="name"
      class="elevation-1"
      v-if="finalServers && finalServers.length == 1 && finalServers[0].index === ''"
      loading
      loading-text="Loading... Please wait"
    ></v-data-table>
    <v-data-table
      v-else-if="finalServers && finalServers.length"
      fixed-header
      :height="tableHeight"
      :headers="headers"
      :items="finalServers"
      :search="search"
      sort-by="index"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title><span class="fa fa-server"></span> Servers</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mx-2" fab small color="success" v-bind="attrs" v-on="on"><v-icon dark>mdi-plus</v-icon></v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle() }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-select v-model="editedServer.protocol" :items="protocols" :rules="protocolRules" label="Protocol" required></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedServer.name"
                          :rules="nameRules"
                          label="Name"
                          :disabled="editedIndex != -1"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedServer.port"
                          :rules="portRules"
                          hide-spin-buttons
                          label="Port"
                          :disabled="editedIndex != -1"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedServer.ramCapacity"
                          :rules="ramCapacityRules"
                          hide-spin-buttons
                          label="RAM capacity"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedServer.availableRAM"
                          :rules="availableRAMRules"
                          hide-spin-buttons
                          label="Available RAM"
                          type="number"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedServer.totalAssignedTenants"
                          :rules="totalAssignedTenantsRules"
                          hide-spin-buttons
                          label="Total assigned tenants"
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
              <v-card-title class="text-h6 justify-center">Are you sure you want to delete this server?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="closeDelete">Cancel</v-btn>
                <v-btn color="error" @click="deleteServerConfirm">Delete</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon color="primary" small class="mr-2" @click="editServer(item)"> mdi-pencil </v-icon>
        <v-menu top :offset-y="true">
          <template v-slot:activator="{ on, attrs }">
            <v-icon color="error" small v-bind="attrs" v-on="on"> mdi-delete </v-icon>
          </template>
          <v-list color="error">
            <v-list-item @click="deleteServer(item, true)">
              <v-list-item-title class="white-list-item-title">With child tenants</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteServer(item, false)">
              <v-list-item-title class="white-list-item-title">Without child tenants</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
import { IndexedServer } from "@/types";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    serverIndex: {
      required: false,
      type: String,
    }
  },
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedServer: { protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0, index: "" },
      defaultServer: { protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0, index: "" },
      headers: [
        { text: "Index", value: "index", align: " d-none" },
        { text: "Name", value: "name" },
        { text: "Port", value: "port" },
        { text: "Protocol", value: "protocol" },
        { text: "RAM capacity", value: "ramCapacity" },
        { text: "Available RAM", value: "availableRAM" },
        { text: "Total tenants", value: "totalAssignedTenants" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      finalServers: [{ protocol: "", name: "", port: 0, ramCapacity: 0, availableRAM: 0, totalAssignedTenants: 0, index: "" }],
      sortField: "index",
      protocols: ["http:", "https:"],
      protocolRules: [(v: string) => !!v || "Protocol is required"],
      nameRules: [(v: string) => !!v || "Name is required"],
      portRules: [(v: string) => !!v || "Port is required"],
      ramCapacityRules: [(v: string) => !!v || "RAM capacity is required"],
      availableRAMRules: [(v: string) => !!v || "Available RAM is required"],
      totalAssignedTenantsRules: [(v: string) => !!v || "Total assigned tenants is required"],
      withChildren: false,
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
    async fetchServers(): Promise<void> {
      serversFunctions.fetchServers().then(async (): Promise<void> => {
        serversFunctions.sortServers().then((servers) => {
          this.finalServers = servers;
        });
      });
    },
    resort(): void {
      serversFunctions.sortServers().then((servers) => {
        this.finalServers = servers;
      });
    },
    formTitle(): string {
      return this.editedIndex == -1 ? "New server" : "Edit server";
    },
    editServer(server: IndexedServer): void {
      this.editedIndex = this.finalServers.indexOf(server);
      this.editedServer = Object.assign({}, server);
      this.dialog = true;
    },
    deleteServer(server: IndexedServer, withChildren: boolean): void {
      this.editedIndex = this.finalServers.indexOf(server);
      this.editedServer = Object.assign({}, server);
      this.withChildren = withChildren;
      this.dialogDelete = true;
    },
    deleteServerConfirm(): void {
      serversFunctions.deleteServerByIndex(this.editedServer.index, this.withChildren).then(() => {
        this.fetchServers();
        this.closeDelete();
      });
    },
    close(): void {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedServer = Object.assign({}, this.defaultServer);
        this.editedIndex = -1;
      });
    },
    closeDelete(): void {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedServer = Object.assign({}, this.defaultServer);
        this.editedIndex = -1;
      });
    },
    save(): void {
      let form: any = this.$refs.form;
      if (serversFunctions.isAvailable(`${this.editedServer.name}:${this.editedServer.port}`, this.editedIndex)) {
        if (form.validate()) {
          serversFunctions.addOrUpdateServer(this.editedServer).then(() => {
            this.fetchServers();
            this.close();
          });
        }
      } else {
        this.$alert(`Server ${this.editedServer.name}:${this.editedServer.port} already exists`);
      }
    },
  },
  created() {
    this.fetchServers();
    if (this.serverIndex) {
      this.search = this.serverIndex;
    } else {
      this.search = ""
    }
  },
});
</script>
