import Vue from "vue";
import vueI18n from "vue-i18n";

import en_US from './lang/en';
import zh_CN from './lang/zh';

Vue.use(vueI18n);

// setup i18n
const i18n = new vueI18n({
  locale: "zh-CN",
  messages: {
    "en-US": en_US,
    "zh-CN": zh_CN
  }
});

export default i18n;
