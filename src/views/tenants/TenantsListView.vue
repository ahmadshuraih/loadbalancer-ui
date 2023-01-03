<template>
  <div>
    <div class="panel-div">
      <label class="panel-label"><span class="fa fa-search"></span> Search by tenant id:</label>
      <input class="panel-input" type="text" v-model="tenantId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" @keyup="$refs.tenantsListComponent?.reSortAndFilter(tenantId, '', false)" />
      <div class="add-button" id="add-button" @click="togglePopup">+</div>
      <ul id="tenant-popup" class="popup-ul">
        <li class="popup" id="staticPopup" @click="showAddForm('Static')">Static add</li>
        <li class="popup" id="dynamicPopup" @click="showAddForm('Dynamic')">Dynamic add</li>
      </ul>
    </div>
    <br />
    <TenantsList :tenantId="tenantId" ref="tenantsListComponent" />
  </div>
</template>

<script lang="ts">
import TenantsList from "@/components/tenants/TenantsList.vue";
import tenantsFunctions from "@/functions/tenants/tenantsFunctions";

export default {
  components: {
    TenantsList,
  },
  data() {
    return {
      tenantId: "",
    };
  },
  methods: {
    showAddForm: function (tenantType: string): void {
      tenantsFunctions.showAddForm(tenantType);
    },
    togglePopup: function (): void {
      tenantsFunctions.showPopup();
    },
  },
};
</script>
