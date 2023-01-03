<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Home msg="Welcome to the Load balancer" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Home from "@/components/Home.vue";

@Component({
  components: {
    Home,
  },
})
export default class HomeView extends Vue {}
</script>

<style scoped>
img {
  width: 200px;
  height: 200px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
}
</style>
