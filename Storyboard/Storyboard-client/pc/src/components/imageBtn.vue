<template>
  <div class="wrapper display-only" :style="wrapperStyle">
    <img
      :src="src"
      :class="imgBorder"
      :style="imgStyle"
      @mouseover="onMouseover()"
      @mouseleave="onMouseleave()"
    />
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mouseover: false
    };
  },
  computed: {
    imgBorder() {
      if (this.mouseover) return `${this.mouseoverClass}`;
      return "";
    }
  },
  props: {
    src: {
      type: String,
      required: true
    },
    wrapperStyle: {
      type: String
    },
    mouseoverClass: {
      type: String,
      default: "img-mouseover-light"
    },
    imgStyle: {
      type: String
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
@import "../common/theme/container.css";
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2px;
  position: relative;
}
</style>
