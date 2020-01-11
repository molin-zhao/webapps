<template>
  <div class="flip-btn-wrapper">
    <div class="btn-front"></div>
    <div class="btn-back"></div>
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: "vertical"
    }
  }
};
</script>

<style lang="scss" scoped>
.flip-btn-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
  }
  .btn-front {
    background-color: red;
  }
  .btn-back {
    background-color: green;
  }
}
</style>
