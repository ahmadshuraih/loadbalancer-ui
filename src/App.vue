<template>
  <v-app id="app">
    <div class="top-app-bar"><span>Load balancer</span></div>
    <img class="logo-img" src="./assets/logo.png" />
    <button id="logout-btn" class="logout-btn hide-login" @click="logout"><span class="fa fa-sign-out"></span> Logout</button>
    <nav id="navigation-bar" class="hide-login">
      <router-link :to="{ name: 'home' }"><span class="fa fa-home fa-lg home-fa-span"></span> Home</router-link>
      <router-link :to="{ name: 'tenants' }"><span class="fa fa-address-card tenants-fa-span"></span> Tenants</router-link>
      <router-link :to="{ name: 'servers' }"><span class="fa fa-server servers-fa-span"></span> Servers</router-link>
      <router-link :to="{ name: 'security' }"><span class="fa fa-lock fa-lg security-fa-span"></span> Security</router-link>
    </nav>
    <div id="nav-white-model" class="nav-white-model hide-login"></div>
    <div id="nav-dark-model" class="nav-dark-model hide-login"></div>
    <div id="page-content" class="page-content logged-out">
      <router-view />
    </div>
  </v-app>
</template>

<script lang="ts">
import loginFunctions from "./functions/security/loginFunctions";

export default {
  methods: {
    logout: function (): void {
      loginFunctions.logout();
    },
  },
  mounted() {
    loginFunctions.checkLogin();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.logo-img {
  position: fixed;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
  z-index: 1;
}

.top-app-bar {
  text-align: left;
  padding-left: 110px;
  position: fixed;
  width: 100%;
  height: 80px;
  background: #ed1c24;
  font-size: 30px;
  font-weight: bold;
  color: white;
  top: 0;
  left: 0;
  line-height: 80px;
  border-bottom-right-radius: 20px;
  z-index: 1;
}

.logout-btn {
  height: 80px;
  background: #ed1c24;
  color: white;
  position: fixed;
  right: 0px;
  top: 0px;
  font-size: 20px;
  padding-left: 16px;
  padding-right: 16px;
  border: none;
  cursor: pointer;
  border-bottom-right-radius: 20px;
  z-index: 1;
}

.logout-btn:hover {
  background: rgba(110, 0, 0, 0.671);
}

.page-content {
  background: #fff6f6;
  border: none solid rgba(204, 192, 192, 0.829);
  border-radius: 20px;
  margin-top: 110px;
  margin-left: 235px;
  margin-right: 35px;
}

.logged-out {
  margin-left: 35px;
}

nav {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 220px;
  background-color: #140001;
  position: fixed;
  height: 90%;
  height: -webkit-calc(90% - 80px);
  height: -moz-calc(90% - 80px);
  height: calc(90% - 80px);
  overflow: auto;
  top: 80px;
  left: 0;
  text-align: left;
}

.nav-white-model {
  width: 20px;
  background: white;
  position: fixed;
  height: 90%;
  height: -webkit-calc(90% - 80px);
  height: -moz-calc(90% - 80px);
  height: calc(90% - 80px);
  overflow: auto;
  top: 80px;
  left: 200px;
  border-top-left-radius: 20px;
}

.nav-dark-model {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 200px;
  background-color: #140001;
  position: fixed;
  height: 10%;
  overflow: auto;
  bottom: 0px;
  left: 0;
  border-bottom-right-radius: 20px;
}

nav a {
  display: block;
  color: white !important;
  padding: 14px 36px 14px 16px;
  text-decoration: none;
  font-size: 20px;
  padding-left: 30px;
}

nav a.router-link-exact-active {
  background-color: #ed1c24;
  color: white;
  font-weight: bold;
}

nav a:hover:not(.router-link-exact-active) {
  background-color: rgba(110, 0, 0, 0.671);
  color: white;
}

.home-fa-span {
  margin-left: -2px;
  margin-right: 5px;
}

.tenants-fa-span {
  margin-right: 7px;
}

.servers-fa-span {
  margin-left: 1px;
  margin-right: 8px;
}

.security-fa-span {
  margin-left: 3px;
  margin-right: 9px;
}

.show-login {
  display: block;
}

.hide-login {
  display: none;
}
</style>
