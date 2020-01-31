// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import VueResource from "vue-resource";

// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

// custom elements
import "@/assets/icon";
import "@/assets/loading";
import Alert from "@/plugins/alert";
import Toast from "@/plugins/toast";
import Confirm from "@/plugins/confirm";

import store from "./store";
import router from "./router";
import i18n from "./i18n";

Vue.config.productionTip = false;
Vue.use(Alert);
Vue.use(Toast);
Vue.use(Confirm);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  store,
  router,
  components: { App },
  template: "<App/>"
});
