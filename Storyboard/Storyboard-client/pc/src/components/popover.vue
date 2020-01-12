<template>
  <transition name="show">
    <div ref="popover" v-show="visible" class="my-popover">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    autoHide: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false
    };
  },
  created() {
    document.addEventListener("click", this.checkClicked);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkClicked);
  },
  methods: {
    checkClicked(event) {
      const e = event || window.event;
      const popover = this.$refs["popover"];
      const { autoHide, visible } = this;
      if (!popover) return;
      if (!popover.contains(e.target) && this.autoHide) {
        // clicked outside and autoHide
        // if (visible) return this.hide();
      }
    },
    show() {
      if (!this.visible) this.visible = true;
    },
    hide() {
      if (this.visible) this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.my-popover {
  position: absolute;
  z-index: 100;
}
.show-enter-active,
.show-leave-active {
  transition: opacity 0.2s;
}

.show-enter,
.show-leave-active {
  opacity: 0;
}
</style>
