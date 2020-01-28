import alert from "@/components/alert.vue";

const Alert = {
  install: function(Vue) {
    const AlertInstance = Vue.extend(alert);
    const initInstance = () => {
      // init vue instance
      currentAlert = new AlertInstance();
      let alertEl = currentAlert.$mount().$el;
      document.body.appendChild(alertEl);
    };
    // add to vue prototype for global use
    let currentAlert = null;
    Vue.prototype.$alert = {
      show(options) {
        if (!currentAlert) initInstance();
        Object.assign(currentAlert, options);
        return currentAlert.show();
      }
    };
  }
};

export default Alert;
