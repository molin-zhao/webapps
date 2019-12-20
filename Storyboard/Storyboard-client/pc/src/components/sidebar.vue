<template>
  <div ref="sidebar" class="sidebar" :style="computedStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      popup: false,
      timer: null
    };
  },
  props: {
    positionVisible: {
      type: String,
      default: "translateX(-5px)"
    },
    positionInvisible: {
      type: String,
      default: "translateX(25vw)"
    },
    sidebarStyle: {
      type: String,
      default: "height: 100vh; width: 25vw;"
    },
    sidebarClass: {
      type: String,
      default: "sidebar-default"
    },
    interval: {
      type: Number,
      default: 1
    }
  },
  computed: {
    computedStyle() {
      return `transition: all ${this.interval}s ease; transform: ${
        this.visible ? this.positionVisible : this.positionInvisible
      }; ${this.sidebarStyle}`;
    }
  },
  created() {
    document.addEventListener("click", this.checkMouseClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkMouseClick);
  },
  methods: {
    checkMouseClick(event) {
      const e = event || window.event;
      let { type, target } = e;
      if (this.$refs["sidebar"] && !this.$refs["sidebar"].contains(target)) {
        // click outside of sidebar
        if (this.popup) return this.hide();
      }
    },
    show() {
      if (!this.visible) {
        this.visible = true;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.popup = true;
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
        }, this.interval * 1000);
      }
    },
    hide() {
      if (this.visible) {
        this.visible = false;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = setTimeout(() => {
          this.popup = false;
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
        }, this.interval * 1000);
      }
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
