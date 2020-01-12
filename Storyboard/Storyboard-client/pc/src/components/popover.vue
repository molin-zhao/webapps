<template>
  <transition name="show">
    <div ref="popover" v-show="visible" class="my-popover">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      clicked: false
    };
  },
  created() {
    document.addEventListener("click", this.checkClicked);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkClicked);
  },
  computed: {
    computedArrowStyle() {}
  },
  methods: {
    checkClicked(event) {
      const e = event || window.event;
      if (this.$refs["popover"] && !this.$refs["popover"].contains(e.target)) {
        this.clicked = true;
      } else {
        this.clicked = false;
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
