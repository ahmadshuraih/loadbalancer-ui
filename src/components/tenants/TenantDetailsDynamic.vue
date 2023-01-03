<template>
  <div class="details-form-div">
    <form class="details-form">
      <h2><span class="fa fa-address-card"></span> Tenant details</h2>
      <label class="details-label">Tenant Id:</label>
      <input class="details-input" type="text" v-model="dynamicTenant.tenantId" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required />
      <label class="details-label">RAM reserved:</label>
      <input class="details-input" type="text" v-model="dynamicTenant.ramReserved" oninput="this.value = this.value.replace(/[^0-9]/g, '')" required />
      <div class="details-button-div">
        <button class="add-update-button" @click="addTenantAddressDynamic"><span class="fa fa-plus"></span> Add</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import tenantFunctions from "@/functions/tenants/tenantsFunctions";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      dynamicTenant: { tenantId: "", ramReserved: 0 },
    };
  },
  methods: {
    addTenantAddressDynamic: function (event: Event): void {
      tenantFunctions.addTenantAddressDynamic(event, this.dynamicTenant);
    },
  },
});
</script>
