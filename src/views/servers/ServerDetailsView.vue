<template>
  <ServerDetails :serverIndex="serverIndex" />
</template>

<script lang="ts">
import ServerDetails from "@/components/servers/ServerDetails.vue";

export default {
  components: {
    ServerDetails,
  },
  props: {
    serverIndex: {
      required: true,
      type: String,
    },
  },
};
</script>
