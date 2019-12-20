<template>
  <div
    class="wrapper"
    :style="computedWrapperStyle"
    ref="icon"
    @mouseover="checkMouseover"
    @mouseleave="checkMouseleave"
  >
    <icon
      :name="name"
      :defaultClass="defaultClass"
      :mouseoverClass="mouseoverClass"
      :style="iconStyle"
      :mouseover="this.mouseover"
    />
    <span :class="`display-only badge ${badgeClass}`" :style="badgeStyle">{{
      badgeNumber
    }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clicked: false,
      mouseover: false
    };
  },
  props: {
    name: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      default: 0
    },
    wrapperStyle: {
      type: String
    },
    wrapperActiveStyle: {
      type: String
    },
    wrapperHoverStyle: {
      type: String
    },
    defaultClass: {
      type: String
    },
    mouseoverClass: {
      type: String
    },
    iconStyle: {
      type: String
    },
    badgeClass: {
      type: String
    },
    badgeStyle: {
      type: String
    },
    onClick: {
      type: Function
    },
    onFinish: {
      type: Function
    }
  },
  computed: {
    badgeNumber() {
      if (this.number > 99) return "99+";
      else if (this.number === 0) return "";
      else return `${this.number}`;
    },
    computedWrapperStyle() {
      if (this.clicked && this.wrapperActiveStyle)
        return `${this.wrapperStyle}; ${this.wrapperActiveStyle}`;
      else if (this.mouseover && this.wrapperHoverStyle)
        return `${this.wrapperStyle}; ${this.wrapperHoverStyle}`;
      else return `${this.wrapperStyle}`;
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
      if (this.$refs.icon && this.$refs.icon.contains(target)) {
        if (!this.clicked) this.clicked = true;
        if (this.onClick) this.onClick();
      } else {
        if (this.clicked) this.clicked = false;
      }
    },
    checkMouseover() {
      if (!this.mouseover) this.mouseover = true;
    },
    checkMouseleave() {
      if (this.mouseover) this.mouseover = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/container.css";
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2px;
  position: relative;
  span {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    font-size: 0.7vw;
  }
}
</style>
