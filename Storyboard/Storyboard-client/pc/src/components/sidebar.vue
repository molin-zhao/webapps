<template>
  <div
    :class="`sidebar ${sidebarClass}`"
    :style="
      `transition: all 1s ease; transform: ${
        visible ? tvisible : tinvisible
      }; ${sidebarStyle}`
    "
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  props: {
    tvisible: {
      type: String,
      default: "translateX(-5px)"
    },
    tinvisible: {
      type: String,
      default: "translateX(25vw)"
    },
    sidebarStyle: {
      type: String,
      default: ""
    },
    sidebarClass: {
      type: String,
      default: "sidebar-default"
    }
  },
  methods: {
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
@import "../common/theme/container.css";
.sidebar {
  position: absolute;
  z-index: 1;
}
</style>
