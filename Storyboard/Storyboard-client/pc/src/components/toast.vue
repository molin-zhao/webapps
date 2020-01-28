<template>
  <div
    v-show="visible"
    class="toast-wrapper shadow"
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    <div class="toast-header">
      <strong class="mr-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button
        @click.stop="resetTimer"
        type="button"
        class="ml-2 mb-1 close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="toast-body">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dismissTimer: null
    };
  },
  props: {
    message: {
      type: String,
      default: "message"
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.dismissTimer = setTimeout(() => {
        if (this) {
          this.visible = false;
          this.resetTimer();
        }
      }, this.interval);
    },
    dismiss() {
      this.visible = false;
    },
    resetTimer() {
      if (this.visible) this.visible = false;
      if (this.dismissTimer) clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.toast-wrapper {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10048 !important;
  background-color: white;
  border: whitesmoke 1px solid;
  border-radius: 5px;
}
</style>
