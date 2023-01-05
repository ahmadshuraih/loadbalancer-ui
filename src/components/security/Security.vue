<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="details-form-div">
    <v-form ref="form" lazy-validation>
      <h2><span class="fa fa-lock"></span> Security</h2>
      <v-text-field
        ref="usernamefield"
        v-model="username"
        append-icon="mdi-eye"
        :rules="usernameRules"
        type="password"
        name="username"
        label="Username"
        @click:append="toggle('username')"
        required
      ></v-text-field>

      <v-text-field
        ref="passwordfield"
        v-model="password"
        append-icon="mdi-eye"
        :rules="passwordRules"
        type="password"
        name="password"
        label="Password"
        @click:append="toggle('password')"
        required
      ></v-text-field>

      <v-text-field
        ref="authenticationfield"
        v-model="authentication"
        append-icon="mdi-eye"
        :rules="authenticationRules"
        type="password"
        name="authentication"
        label="Authentication"
        @click:append="toggle('authentication')"
        required
      ></v-text-field>

      <v-text-field
        ref="authorizationfield"
        v-model="authorization"
        append-icon="mdi-eye"
        :rules="authorizationRules"
        type="password"
        name="authorization"
        label="Authorization"
        @click:append="toggle('authorization')"
        required
      ></v-text-field>

      <v-btn color="primary" class="mr-4" @click="update"> Update </v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent } from "vue";
import securityConfig from "@/functions/security/securityConfig";
import securityFunctions from "@/functions/security/securityFunctions";
import { SecurityInfoShow } from "@/types";

export default defineComponent({
  data() {
    return {
      username: securityConfig.getUsername(),
      password: securityConfig.getPassword(),
      authentication: securityConfig.getAuthenticationToken(),
      authorization: securityConfig.getAuthorizationToken(),
      usernameRules: [(v: string) => !!v || "Username is required"],
      passwordRules: [(v: string) => !!v || "Password is required"],
      authenticationRules: [(v: string) => !!v || "Authentication token is required"],
      authorizationRules: [(v: string) => !!v || "Authorization token is required"],
      show: {
        username: false,
        password: false,
        authentication: false,
        authorization: false,
      },
      dialog: false,
    };
  },
  methods: {
    update(event: Event) {
      let form: any = this.$refs.form;
      const securityInfo = {
        username: this.username,
        password: this.password,
        authenticationToken: this.authentication,
        authorizationToken: this.authorization,
      };
      if (form.validate()) securityFunctions.updateSecurityInfo(event, securityInfo);
    },
    async toggle(field: string): Promise<void> {
      let show = true;
      if (!this.show[field as keyof SecurityInfoShow] && !(await securityFunctions.checkPassword())) {
        show = false;
      }

      if (show) {
        let input: any = this.$refs[`${field}field`];
        this.show[field as keyof SecurityInfoShow] = !this.show[field as keyof SecurityInfoShow];
        input["appendIcon"] = this.show[field as keyof SecurityInfoShow] ? "mdi-eye-off" : "mdi-eye";
        input["type"] = this.show[field as keyof SecurityInfoShow] ? "text" : "password";
      }
    },
  },
});
</script>
