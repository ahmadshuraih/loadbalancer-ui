<template>
  <div>
    <div class="panel-div">
      <label class="panel-label"><span class="fa fa-search"></span> Search by index:</label>
      <input class="panel-input" type="text" v-model="serverIndex" @keyup="$refs.serverListComponent?.reSortAndFilter(serverIndex, '', false)" />
      <button class="add-button" @click="showAddForm">+</button>
    </div>
    <br />
    <ServersList :serverIndex="serverIndex" ref="serverListComponent" />
  </div>
</template>

<script lang="ts">
import ServersList from "@/components/servers/ServersList.vue";
import serversFunctions from "@/functions/servers/serversFunctions";

export default {
  components: {
    ServersList,
  },
  data() {
    return {
      serverIndex: "",
    };
  },
  methods: {
    showAddForm: function (): void {
      serversFunctions.showAddForm();
    },
  },
};
</script>
