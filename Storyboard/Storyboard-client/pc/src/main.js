// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// icons
import "@/assets/icon";

import store from "./store";
import router from "./router";
import i18n from "./i18n";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  store,
  router,
  components: { App },
  template: "<App/>"
});
