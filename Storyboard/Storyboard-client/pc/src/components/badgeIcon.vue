<template>
  <div
    class="wrapper"
    :style="computedWrapperStyle"
    ref="icon"
    @mouseover="checkMouseover"
    @mouseleave="checkMouseleave"
  >
    <icon :name="computedIconName" :style="computedIconStyle" />
    <span :class="`display-only badge ${badgeClass}`" :style="badgeStyle">{{
      computedBadgeNumber
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
    number: {
      type: Number,
      default: 0
    },
    wrapperStyle: {
      type: Object,
      default: {
        plain: "",
        active: "",
        hover: ""
      }
    },
    iconStyle: {
      type: Object,
      default: {
        plain: "",
        active: "",
        hover: ""
      }
    },
    iconName: {
      type: Object,
      required: true,
      default: {
        plain: "",
        active: "",
        hover: ""
      }
    },
    badgeClass: {
      type: String
    },
    badgeStyle: {
      type: String
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedBadgeNumber() {
      if (this.number > 99) return "99+";
      else if (this.number === 0) return "";
      else return `${this.number}`;
    },
    computedWrapperStyle() {
      const { plain, active, hover } = this.wrapperStyle;
      if (this.clicked && active) return `${plain}; ${active}`;
      else if (this.mouseover && hover) return `${plain}; ${hover}`;
      else return `${plain}`;
    },
    computedIconName() {
      const { plain, active, hover } = this.iconName;
      if (this.clicked && active) return `${active}`;
      else if (this.mouseover && hover) return `${hover}`;
      else return `${plain}`;
    },
    computedIconStyle() {
      const { plain, active, hover } = this.iconStyle;
      if (this.clicked && active) return `${plain}; ${active}`;
      else if (this.mouseover && hover) return `${plain}; ${hover}`;
      else return `${plain}`;
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
        if (this.reverse) {
          this.clicked = !this.clicked;
        } else {
          if (!this.clicked) this.clicked = true;
        }
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
  padding: 0;
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
