<template>
  <div ref="sidebar" class="sidebar" :style="computedStyle">
    <slot></slot>
  </div>
</template>

<script>
import { eventBus } from "@/common/utils/eventBus";
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
      const { visible, positionVisible, positionInvisible, interval } = this;
      return `
      transition: all ${interval}s ease; 
      -moz-transition: all ${interval}s ease;
      -webkit-transition: all ${interval}s ease;
      -o-transition: all ${interval}s ease; 
      transform: ${visible ? positionVisible : positionInvisible}; 
      ${this.sidebarStyle}`;
    }
  },
  methods: {
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
  },
  mounted() {
    eventBus.$on("reset-visible-component", () => {
      this.hide();
    });
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
