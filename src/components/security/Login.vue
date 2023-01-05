<template>
  <div class="details-form-div">
    <v-form ref="form" lazy-validation>
      <h2>Login</h2>
      <v-text-field v-model="username" :rules="usernameRules" label="Username" @keyup.enter="login" required></v-text-field>

      <v-text-field
        ref="passwordfield"
        v-model="password"
        append-icon="mdi-eye"
        :rules="passwordRules"
        type="password"
        name="password"
        label="Password"
        @click:append="toggle('passwordfield')"
        @keyup.enter="login"
        required
      ></v-text-field>

      <v-btn color="error" class="mr-4" @click="login"> Login </v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import loginFunctions from "@/functions/security/loginFunctions";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      show: false,
      username: "",
      usernameRules: [(v: string) => !!v || "Username is required"],
      password: "",
      passwordRules: [(v: string) => !!v || "Password is required"],
    };
  },
  methods: {
    login(): void {
      let form: any = this.$refs.form;
      if (form.validate()) loginFunctions.login(this.username, this.password);
    },
    toggle(field: string): void {
      let passwordinput: any = this.$refs[field];
      this.show = !this.show;
      passwordinput["appendIcon"] = this.show ? "mdi-eye-off" : "mdi-eye";
      passwordinput["type"] = this.show ? "text" : "password";
    },
  },
});
</script>

<style scoped>
.mr-4 {
  margin-right: 0px !important;
  margin-top: 10px;
}

h2 {
  margin-bottom: 20px;
}
</style>
