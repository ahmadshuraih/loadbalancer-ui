import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/global.css";
import '@mdi/font/css/materialdesignicons.css'
import VueSimpleAlert from "vue-simple-alert";
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");

Vue.use(VueSimpleAlert);
