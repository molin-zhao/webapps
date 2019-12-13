<template>
  <svg
    :class="
      `svg-icon
      ${this.mouseover ? this.mouseoverClass : ''}
      ${this.defaultClass}
      `
    "
    aria-hidden="true"
    @mouseover="onMouseover()"
    @mouseleave="onMouseleave()"
  >
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: "icon",
  data() {
    return {
      mouseover: false
    };
  },
  props: {
    name: {
      type: String,
      required: true
    },
    mouseoverClass: {
      type: String,
      default: "icon-mouseover-light"
    },
    defaultClass: {
      type: String,
      default: "icon-default"
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`;
    }
  },
  methods: {
    onMouseover() {
      this.mouseover = true;
    },
    onMouseleave() {
      this.mouseover = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../common/theme/color.css";
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
