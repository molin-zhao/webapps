<template>
  <transition name="show">
    <div ref="popover" v-show="visible" class="my-popover">
      <div class="arrow" v-show="showPopupArrow" :style="computedArrowStyle" />
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
  props: {
    onClick: {
      type: Function
    },
    onFinish: {
      type: Function
    },
    showPopupArrow: {
      type: Boolean,
      default: false
    },
    popupArrowStyle: {
      type: String
    },
    popupArrowColor: {
      type: String,
      default: "black"
    },
    popupArrowPosition: {
      type: String,
      default: "right"
    },
    popupArrowSize: {
      type: String,
      default: "0.5vw"
    }
  },
  created() {
    document.addEventListener("click", this.checkClicked);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.checkClicked);
  },
  computed: {
    computedArrowStyle() {
      let borderWidth = `border-width: ${this.popupArrowSize}`;
      let borderColor;
      switch (this.popupArrowPosition) {
        case "top":
          borderColor = `border-color: ${this.popupArrowColor} transparent transparent transparent`;
          break;
        case "right":
          borderColor = `border-color: transparent ${this.popupArrowColor} transparent transparent`;
          break;
        case "bottom":
          borderColor = `border-color: transparent transparent ${this.popupArrowColor} transparent`;
          break;
        default:
          // left
          borderColor = `transparent transparent transparent ${this.popupArrowColor}`;
          break;
      }
      return `${borderWidth}; ${borderColor}; ${this.popupArrowStyle}`;
    }
  },
  methods: {
    checkClicked(event) {
      const e = event || window.event;
      if (this.$refs["popover"] && !this.$refs["popover"].contains(e.target)) {
        this.clicked = true;
        if (this.onClick) this.onClick();
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
  .arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
  }
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
