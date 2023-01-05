<template>
  <ServersList :serverIndex="serverIndex"/>
</template>

<script lang="ts">
import ServersList from "@/components/servers/ServersList.vue";

export default {
  components: {
    ServersList,
  },
  props: {
    serverIndex: {
      required: false,
      type: String,
    }
  },
};
</script>
