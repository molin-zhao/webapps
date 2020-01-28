import confirm from "@/components/confirm.vue";

const Confirm = {
  install: function(Vue) {
    const ConfirmInstance = Vue.extend(confirm);
    const initInstance = () => {
      // init vue instance
      currentConfirm = new ConfirmInstance();
      let ConfirmEl = currentConfirm.$mount().$el;
      document.body.appendChild(ConfirmEl);
    };
    // add to vue prototype for global use
    let currentConfirm = null;
    Vue.prototype.$confirm = {
      show(options) {
        if (!currentConfirm) initInstance();
        Object.assign(currentConfirm, options);
        return currentConfirm.show();
      }
    };
  }
};

export default Confirm;
