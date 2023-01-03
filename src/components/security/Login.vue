<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="details-form-div">
    <form class="details-form">
      <h2><span class="fa fa-sign-in"></span> Login</h2>
      <label class="details-label">Username</label>
      <input type="text" class="details-input" v-model="username" required />
      <label class="details-label">Password</label>
      <input type="password" class="details-input-password" id="password" v-model="password" required />
      <i class="far fa-eye details-toggle-eye" id="togglePassword-password" @click="showPassword('password')"></i>
      <div class="details-button-div">
        <button class="delete-button" @click="login"><span class="fa fa-sign-in"></span> Login</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import loginFunctions from "@/functions/security/loginFunctions";

export default defineComponent({
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    showPassword: function (input: string): void {
      loginFunctions.togglePassword(input);
    },
    login: function (event: Event): void {
      loginFunctions.login(event, this.username, this.password);
    },
  }
});
</script>
