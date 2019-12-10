// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// icons
import '@/assets/icon';

import vueI18n from "vue-i18n";
import vueRouter from "vue-router";
import vuex from "vuex";

// language packages
import zh_CN from "./common/lang/zh";
import en_US from "./common/lang/en";

// vuex store template
import store_template from "./store";

// vue router template
import router_template from "./router";

Vue.use(vueI18n);
Vue.use(vueRouter);
Vue.use(vuex);

// setup i18n
const i18n = new vueI18n({
  locale: "zh-CN",
  messages: {
    "en-US": en_US,
    "zh-CN": zh_CN
  }
});

// setup vuex store
const store = new vuex.Store(store_template);

// setup vue router
const router = new vueRouter(router_template);

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
