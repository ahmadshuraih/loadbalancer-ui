<template>
  <div>
    <TenantDetails v-if="tenantType === 'Static'" :tenantId="tenantId" />
    <TenantDetailsDynamic v-if="tenantType === 'Dynamic'" />
  </div>
</template>

<script lang="ts">
import TenantDetails from "@/components/tenants/TenantDetails.vue";
import TenantDetailsDynamic from "@/components/tenants/TenantDetailsDynamic.vue";

export default {
  components: {
    TenantDetails,
    TenantDetailsDynamic,
  },
  props: {
    tenantId: {
      required: true,
      type: String,
    },
    tenantType: {
      required: true,
      type: String,
    },
  },
};
</script>
