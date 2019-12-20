<template>
  <div
    :class="
      `alert alert-${type} alert-dismissible fade ${show ? 'show' : null}`
    "
  >
    <span v-if="message" class="display-only">{{ message }}</span>
    <slot v-else></slot>
    <button
      @click="resetTimer"
      type="button"
      class="close"
      data-dismiss="alert"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      type: "secondary",
      message: "",
      dismissTimer: null
    };
  },
  props: {
    interval: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    alert(type, message) {
      this.type = type;
      this.message = message;
      this.show = true;
      this.dismissTimer = setTimeout(() => {
        this.resetTimer();
        this.show = false;
      }, this.interval);
    },
    dismiss() {
      this.show = false;
    },
    resetTimer() {
      if (this.dismissTimer) clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
div.alert {
  position: absolute;
  top: 5px;
  z-index: 10050 !important;
}
</style>
