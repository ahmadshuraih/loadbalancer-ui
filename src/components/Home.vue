<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Using this application you can manage and configure the load balancer of latest collection server.</p>
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    msg: {
      required: true,
      type: String,
    },
  },
});
</script>
