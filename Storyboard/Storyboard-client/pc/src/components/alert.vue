<template>
  <div
    :class="
      `alert alert-${type} alert-dismissible fade ${show ? 'show' : null}`
    "
  >
    <span v-if="message" class="display-only">{{ message }}</span>
    <slot v-else></slot>
    <button @click="resetTimer" class="close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      dismissTimer: null
    };
  },
  props: {
    type: {
      type: String,
      default: "secondary"
    },
    message: {
      type: String,
      default: "message"
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  // watch: {
  //   show(val) {
  //     console.log(val);
  //   }
  // },
  methods: {
    alert() {
      this.show = true;
      this.dismissTimer = setTimeout(() => {
        // automatically close alert
        if (this) {
          this.show = false;
          this.resetTimer();
        }
      }, this.interval);
    },
    dismiss() {
      this.show = false;
    },
    resetTimer() {
      if (this.show) this.show = false;
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
  left: 50%;
  transform: translateX(-50%);
  z-index: 10050 !important;
}
</style>
