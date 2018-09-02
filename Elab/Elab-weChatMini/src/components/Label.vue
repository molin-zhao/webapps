<template>
  <div class="label">
    <img mode="scaleToFill" :src="src">
    <p :style="{fontSize: fontSize, color: color}">{{label}}</p>
  </div>
</template>
<script>
export default {
  props: ['label', 'fontSize', 'color', 'src']
}
</script>
<style lang="scss">
.label {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
  p {
    position: absolute;
    margin: auto;
    left: 33%;
    top: 15%;
  }
}
</style>


