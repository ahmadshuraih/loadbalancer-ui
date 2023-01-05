<template>
  <TenantsList :tenantId="tenantId"/>
</template>

<script lang="ts">
import TenantsList from "@/components/tenants/TenantsList.vue";

export default {
  components: {
    TenantsList,
  },
  props: {
    tenantId: {
      required: false,
      type: String,
    }
  },
};
</script>
