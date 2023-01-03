<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="details-form-div">
    <form class="details-form">
      <h2><span class="fa fa-lock"></span> Security</h2>
      <label class="details-label">Username:</label>
      <input class="details-input-password" type="password" v-model="username" id="username" required />
      <i class="far fa-eye details-toggle-eye" id="togglePassword-username" @click="showToken('username')"></i>
      <label class="details-label">Password:</label>
      <input class="details-input-password" type="password" v-model="password" id="password" required />
      <i class="far fa-eye details-toggle-eye" id="togglePassword-password" @click="showToken('password')"></i>
      <label class="details-label">Authentication token:</label>
      <input class="details-input-password" type="password" v-model="authentication" id="authentication" required />
      <i class="far fa-eye details-toggle-eye" id="togglePassword-authentication" @click="showToken('authentication')"></i>
      <label class="details-label">Authorization token:</label>
      <input class="details-input-password" type="password" v-model="authorization" id="authorization" required />
      <i class="far fa-eye details-toggle-eye" id="togglePassword-authorization" @click="showToken('authorization')"></i>
      <div class="details-button-div">
        <button class="add-update-button" @click="update"><span class="fa fa-edit"></span> Update</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import securityConfig from "@/functions/security/securityConfig";
import securityFunctions from "@/functions/security/securityFunctions";

export default defineComponent({
  data() {
    return {
      username: securityConfig.getUsername(),
      password: securityConfig.getPassword(),
      authentication: securityConfig.getAuthenticationToken(),
      authorization: securityConfig.getAuthorizationToken(),
    };
  },
  methods: {
    showToken: function (input: string) {
      securityFunctions.togglePassword(input);
    },
    update: function (event: Event) {
      const securityInfo = {
        username: this.username,
        password: this.password,
        authenticationToken: this.authentication,
        authorizationToken: this.authorization,
      };
      securityFunctions.updateSecurityInfo(event, securityInfo);
    },
  },
});
</script>
